var fs = require('fs');
var path = require('path');
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as thing from './constructs/thing-construct'
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
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloudFormationReadOnlyAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess')
      ]
    });
    
    const secureTunnelInstanceProfile = new iam.CfnInstanceProfile( this,'secureTunnelProfile',{
        roles: [instanceRole.roleName]
    })

    const ubuntuAmi = ec2.MachineImage.lookup({
      name: 'ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*',
      owners: ['099720109477'],
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
