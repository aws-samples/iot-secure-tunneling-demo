var fs = require('fs');
var path = require('path');
import ec2 = require('@aws-cdk/aws-ec2');
import {InstanceClass,InstanceSize,InstanceType} from '@aws-cdk/aws-ec2';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');

let keyConfig = require(`${__dirname}/../../config/ec2/key-pair.json`);

const ENV_PROPS = {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION }
}

const KEY_NAME = keyConfig.KeyName;

export class AwsIotSecTunnelStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id, ENV_PROPS);
    let deviceVpc = new ec2.Vpc(this, 'iotSecureTunneling',{
      maxAzs: 2,
    });  
    const instanceRole = new iam.Role(this,'ssminstancerole',
    {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloudFormationReadOnlyAccess')
      ],
    });
    const secureTunnelInstanceProfile = new iam.CfnInstanceProfile( this,'secureTunnelProfile',{
        roles: [instanceRole.roleName]
    })

    const ubuntuAmi = ec2.MachineImage.lookup({
      name: 'ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20200112',
    }).getImage(this).imageId;
    let device = new ec2.CfnInstance(this, "device",{
      imageId: ubuntuAmi,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO).toString(),
      iamInstanceProfile: secureTunnelInstanceProfile.ref,
      keyName: KEY_NAME,
      subnetId: deviceVpc.publicSubnets[0].subnetId,
      tags: [{key: "Name", value: "iot-secure-tunnel-demo-device"}],
      userData: cdk.Fn.base64(`#!/bin/bash
apt-get -y update
apt-get -y install build-essential g++ tmux nodejs npm git jq awscli
          
cd /home/ubuntu
su - ubuntu -c 'git clone https://github.com/marcosortiz/aws-iot-secure-tunneling.git'
cd /home/ubuntu/aws-iot-secure-tunneling
su - ubuntu -c 'cd /home/ubuntu/aws-iot-secure-tunneling && git checkout dev'
su - ubuntu -c 'cd /home/ubuntu/aws-iot-secure-tunneling/device-agent && npm install'
su - ubuntu -c 'cd /home/ubuntu/aws-iot-secure-tunneling && ./bin/device-agent/run.sh'`
      )
    });

    let s3Bucket = new s3.Bucket(this, 'aws-secure-tunneling-demo');

    new cdk.CfnOutput(this, 's3BucketName', {
      value: s3Bucket.bucketName,
      description: 'S3 bucket that will hold some objects needed to run this demo.'
    });

  }
}