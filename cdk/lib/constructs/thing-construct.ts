import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface IotThingProps {
    machineImageId: string;
    instanceProfile: iam.CfnInstanceProfile;
    vpc: ec2.Vpc;
    keyName: string;
    thingName: string;
    resources: string[]
    githubRepoUrl: string;
}


export class IotThing extends Construct {
    constructor(scope: Construct, id: string, props: IotThingProps) {
        super(scope, id);
        
        let userData = `#!/bin/bash
            apt-get -y update
            apt-get -y install build-essential g++ tmux nodejs npm git jq awscli
                      
            cd /home/ubuntu
            su - ubuntu -c 'git clone ` + props.githubRepoUrl + `'
            su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo'`
        
        props.resources.forEach(resource => {
            userData = userData + 
                `su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/` + resource + ` && npm install\n'
                su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/` + resource + `/run.sh'\n`    
        })
      
        const thing = new ec2.CfnInstance(this, props.thingName, {
            imageId: props.machineImageId,
            instanceType: 'c6g.medium',
            iamInstanceProfile: props.instanceProfile.ref,
            keyName: props.keyName,
            subnetId: props.vpc.publicSubnets[0].subnetId,
            tags: [{key: "Name", value: props.thingName}],
            userData: cdk.Fn.base64(userData)
        });
    }
}
