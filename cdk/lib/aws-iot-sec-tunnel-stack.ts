var fs = require('fs');
var path = require('path');
import ec2 = require('@aws-cdk/aws-ec2');
import {InstanceClass,InstanceSize,InstanceType} from '@aws-cdk/aws-ec2';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import thing = require('./constructs/thing-construct')
import * as configJson from "../../config/config.json"

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
    
    const githubRepoUrl = new cdk.CfnParameter(this, 'githubRepoUrl', {
      type: "String",
      description: "The location of the Github repo used for the demo",
      default: "https://github.com/aws-samples/iot-secure-tunneling-demo.git"
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
    
    configJson.things.forEach(thingConfig=> {
      
      /* create thing through construct */
      new thing.IotThing(this, thingConfig.name, {
        machineImageId: ubuntuAmi,
        vpc: deviceVpc,
        keyName: KEY_NAME,
        thingName: thingConfig.name,
        instanceProfile: secureTunnelInstanceProfile,
        githubRepoUrl: githubRepoUrl.valueAsString,
        resources: thingConfig.resources
      });  
    });
    
    let s3Bucket = new s3.Bucket(this, 'aws-secure-tunneling-demo');

    new cdk.CfnOutput(this, 's3BucketName', {
      value: s3Bucket.bucketName,
      description: 'S3 bucket that will hold some objects needed to run this demo.'
    });
    
  }
}