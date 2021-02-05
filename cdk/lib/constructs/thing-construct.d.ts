import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
export interface IotThingProps {
    machineImageId: string;
    instanceProfile: iam.CfnInstanceProfile;
    vpc: ec2.Vpc;
    keyName: string;
    thingName: string;
    resources: string[];
    githubRepoUrl: string;
}
export declare class IotThing extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: IotThingProps);
}
