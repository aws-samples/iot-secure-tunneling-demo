import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export interface IotThingProps {
    machineImageId: string;
    instanceProfile: iam.CfnInstanceProfile;
    vpc: ec2.Vpc;
    keyName: string;
    thingName: string;
    resources: string[];
    githubRepoUrl: string;
}
export declare class IotThing extends Construct {
    constructor(scope: Construct, id: string, props: IotThingProps);
}
