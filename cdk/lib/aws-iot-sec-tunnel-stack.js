"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsIotSecTunnelStack = void 0;
var fs = require('fs');
var path = require('path');
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
let keyConfig = require(`${__dirname}/../../config/ec2/key-pair.json`);
const ENV_PROPS = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
};
const KEY_NAME = keyConfig.KeyName;
class AwsIotSecTunnelStack extends cdk.Stack {
    constructor(app, id) {
        super(app, id, ENV_PROPS);
        let deviceVpc = new ec2.Vpc(this, 'iotSecureTunneling', {
            maxAzs: 2,
        });
        const githubRepoUrl = new cdk.CfnParameter(this, 'githubRepoUrl', {
            type: "String",
            description: "The location of the Github repo used for the demo",
            default: "https://github.com/aws-samples/iot-secure-tunneling-demo.git"
        });
        const instanceRole = new iam.Role(this, 'ssminstancerole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloudFormationReadOnlyAccess')
            ],
        });
        const secureTunnelInstanceProfile = new iam.CfnInstanceProfile(this, 'secureTunnelProfile', {
            roles: [instanceRole.roleName]
        });
        const ubuntuAmi = ec2.MachineImage.lookup({
            name: 'ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20200112',
        }).getImage(this).imageId;
        let device = new ec2.CfnInstance(this, "device", {
            imageId: ubuntuAmi,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.BURSTABLE2, aws_ec2_1.InstanceSize.MICRO).toString(),
            iamInstanceProfile: secureTunnelInstanceProfile.ref,
            keyName: KEY_NAME,
            subnetId: deviceVpc.publicSubnets[0].subnetId,
            tags: [{ key: "Name", value: "iot-secure-tunnel-demo-device" }],
            userData: cdk.Fn.base64(`#!/bin/bash
apt-get -y update
apt-get -y install build-essential g++ tmux nodejs npm git jq awscli
          
cd /home/ubuntu
su - ubuntu -c 'git clone ` + githubRepoUrl.valueAsString + `'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/device-agent && npm install'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/device-agent/run.sh'`)
        });
        let s3Bucket = new s3.Bucket(this, 'aws-secure-tunneling-demo');
        new cdk.CfnOutput(this, 's3BucketName', {
            value: s3Bucket.bucketName,
            description: 'S3 bucket that will hold some objects needed to run this demo.'
        });
        let deviceMultiPlex = new ec2.CfnInstance(this, "deviceMultiPlex", {
            imageId: ubuntuAmi,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.BURSTABLE2, aws_ec2_1.InstanceSize.MICRO).toString(),
            iamInstanceProfile: secureTunnelInstanceProfile.ref,
            keyName: KEY_NAME,
            subnetId: deviceVpc.publicSubnets[0].subnetId,
            tags: [{ key: "Name", value: "iot-secure-tunnel-multiplex-demo-device" }],
            userData: cdk.Fn.base64(`#!/bin/bash
apt-get -y update
apt-get -y install build-essential g++ tmux nodejs npm git jq awscli
          
cd /home/ubuntu
su - ubuntu -c 'git clone ` + githubRepoUrl.valueAsString + `'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/device-agent && npm install'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/device-agent/run.sh'`)
        });
    }
}
exports.AwsIotSecTunnelStack = AwsIotSecTunnelStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0Isd0NBQXlDO0FBQ3pDLDhDQUF5RTtBQUN6RSx3Q0FBeUM7QUFDekMscUNBQXNDO0FBQ3RDLHNDQUF1QztBQUV2QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxTQUFTLGlDQUFpQyxDQUFDLENBQUM7QUFFdkUsTUFBTSxTQUFTLEdBQUc7SUFDaEIsR0FBRyxFQUFFO1FBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1FBQ3hDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQjtLQUFFO0NBQzNDLENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBRW5DLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxHQUFZLEVBQUUsRUFBVTtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUxQixJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFDO1lBQ3JELE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDaEUsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsbURBQW1EO1lBQ2hFLE9BQU8sRUFBRSw4REFBOEQ7U0FDeEUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxpQkFBaUIsRUFDeEQ7WUFDRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7WUFDeEQsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsa0NBQWtDLENBQUM7Z0JBQzlFLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsaUNBQWlDLENBQUM7YUFDOUU7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLDJCQUEyQixHQUFHLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFFLElBQUksRUFBQyxxQkFBcUIsRUFBQztZQUN2RixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQ2pDLENBQUMsQ0FBQTtRQUVGLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUksRUFBRSxpRUFBaUU7U0FDeEUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7WUFDOUMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUFDLHVCQUFhLENBQUMsVUFBVSxFQUFFLHNCQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ3RGLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLEdBQUc7WUFDbkQsT0FBTyxFQUFFLFFBQVE7WUFDakIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtZQUM3QyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLCtCQUErQixFQUFDLENBQUM7WUFDN0QsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDOzs7OzsyQkFLSCxHQUFHLGFBQWEsQ0FBQyxhQUFhLEdBQUc7Ozt3RkFHNEIsQ0FDakY7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFFaEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO1lBQzFCLFdBQVcsRUFBRSxnRUFBZ0U7U0FDOUUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBQztZQUNoRSxPQUFPLEVBQUUsU0FBUztZQUNsQixZQUFZLEVBQUUsc0JBQVksQ0FBQyxFQUFFLENBQUMsdUJBQWEsQ0FBQyxVQUFVLEVBQUUsc0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDdEYsa0JBQWtCLEVBQUUsMkJBQTJCLENBQUMsR0FBRztZQUNuRCxPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1lBQzdDLElBQUksRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUseUNBQXlDLEVBQUMsQ0FBQztZQUN2RSxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7Ozs7OzJCQUtILEdBQUcsYUFBYSxDQUFDLGFBQWEsR0FBRzs7O3dGQUc0QixDQUNqRjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQTdFRCxvREE2RUMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5pbXBvcnQgZWMyID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjMicpO1xuaW1wb3J0IHtJbnN0YW5jZUNsYXNzLEluc3RhbmNlU2l6ZSxJbnN0YW5jZVR5cGV9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IGlhbSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1pYW0nKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcblxubGV0IGtleUNvbmZpZyA9IHJlcXVpcmUoYCR7X19kaXJuYW1lfS8uLi8uLi9jb25maWcvZWMyL2tleS1wYWlyLmpzb25gKTtcblxuY29uc3QgRU5WX1BST1BTID0ge1xuICBlbnY6IHsgXG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB9XG59XG5cbmNvbnN0IEtFWV9OQU1FID0ga2V5Q29uZmlnLktleU5hbWU7XG5cbmV4cG9ydCBjbGFzcyBBd3NJb3RTZWNUdW5uZWxTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQsIEVOVl9QUk9QUyk7XG4gICAgXG4gICAgbGV0IGRldmljZVZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdpb3RTZWN1cmVUdW5uZWxpbmcnLHtcbiAgICAgIG1heEF6czogMixcbiAgICB9KTsgIFxuICAgIFxuICAgIGNvbnN0IGdpdGh1YlJlcG9VcmwgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnZ2l0aHViUmVwb1VybCcsIHtcbiAgICAgIHR5cGU6IFwiU3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbG9jYXRpb24gb2YgdGhlIEdpdGh1YiByZXBvIHVzZWQgZm9yIHRoZSBkZW1vXCIsXG4gICAgICBkZWZhdWx0OiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hd3Mtc2FtcGxlcy9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vLmdpdFwiXG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgaW5zdGFuY2VSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsJ3NzbWluc3RhbmNlcm9sZScsXG4gICAge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUMyUm9sZWZvclNTTScpLFxuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FXU0Nsb3VkRm9ybWF0aW9uUmVhZE9ubHlBY2Nlc3MnKVxuICAgICAgXSxcbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCBzZWN1cmVUdW5uZWxJbnN0YW5jZVByb2ZpbGUgPSBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZSggdGhpcywnc2VjdXJlVHVubmVsUHJvZmlsZScse1xuICAgICAgICByb2xlczogW2luc3RhbmNlUm9sZS5yb2xlTmFtZV1cbiAgICB9KVxuXG4gICAgY29uc3QgdWJ1bnR1QW1pID0gZWMyLk1hY2hpbmVJbWFnZS5sb29rdXAoe1xuICAgICAgbmFtZTogJ3VidW50dS9pbWFnZXMvaHZtLXNzZC91YnVudHUtYmlvbmljLTE4LjA0LWFtZDY0LXNlcnZlci0yMDIwMDExMicsXG4gICAgfSkuZ2V0SW1hZ2UodGhpcykuaW1hZ2VJZDtcbiAgICBcbiAgICBsZXQgZGV2aWNlID0gbmV3IGVjMi5DZm5JbnN0YW5jZSh0aGlzLCBcImRldmljZVwiLHtcbiAgICAgIGltYWdlSWQ6IHVidW50dUFtaSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMiwgSW5zdGFuY2VTaXplLk1JQ1JPKS50b1N0cmluZygpLFxuICAgICAgaWFtSW5zdGFuY2VQcm9maWxlOiBzZWN1cmVUdW5uZWxJbnN0YW5jZVByb2ZpbGUucmVmLFxuICAgICAga2V5TmFtZTogS0VZX05BTUUsXG4gICAgICBzdWJuZXRJZDogZGV2aWNlVnBjLnB1YmxpY1N1Ym5ldHNbMF0uc3VibmV0SWQsXG4gICAgICB0YWdzOiBbe2tleTogXCJOYW1lXCIsIHZhbHVlOiBcImlvdC1zZWN1cmUtdHVubmVsLWRlbW8tZGV2aWNlXCJ9XSxcbiAgICAgIHVzZXJEYXRhOiBjZGsuRm4uYmFzZTY0KGAjIS9iaW4vYmFzaFxuYXB0LWdldCAteSB1cGRhdGVcbmFwdC1nZXQgLXkgaW5zdGFsbCBidWlsZC1lc3NlbnRpYWwgZysrIHRtdXggbm9kZWpzIG5wbSBnaXQganEgYXdzY2xpXG4gICAgICAgICAgXG5jZCAvaG9tZS91YnVudHVcbnN1IC0gdWJ1bnR1IC1jICdnaXQgY2xvbmUgYCArIGdpdGh1YlJlcG9VcmwudmFsdWVBc1N0cmluZyArIGAnXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8nXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8vZGV2aWNlLWFnZW50ICYmIG5wbSBpbnN0YWxsJ1xuc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vICYmIC4vYmluL2RldmljZS1hZ2VudC9ydW4uc2gnYFxuICAgICAgKVxuICAgIH0pO1xuXG4gICAgbGV0IHMzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnYXdzLXNlY3VyZS10dW5uZWxpbmctZGVtbycpO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ3MzQnVja2V0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBzM0J1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdTMyBidWNrZXQgdGhhdCB3aWxsIGhvbGQgc29tZSBvYmplY3RzIG5lZWRlZCB0byBydW4gdGhpcyBkZW1vLidcbiAgICB9KTtcblxuICAgIGxldCBkZXZpY2VNdWx0aVBsZXggPSBuZXcgZWMyLkNmbkluc3RhbmNlKHRoaXMsIFwiZGV2aWNlTXVsdGlQbGV4XCIse1xuICAgICAgaW1hZ2VJZDogdWJ1bnR1QW1pLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUyLCBJbnN0YW5jZVNpemUuTUlDUk8pLnRvU3RyaW5nKCksXG4gICAgICBpYW1JbnN0YW5jZVByb2ZpbGU6IHNlY3VyZVR1bm5lbEluc3RhbmNlUHJvZmlsZS5yZWYsXG4gICAgICBrZXlOYW1lOiBLRVlfTkFNRSxcbiAgICAgIHN1Ym5ldElkOiBkZXZpY2VWcGMucHVibGljU3VibmV0c1swXS5zdWJuZXRJZCxcbiAgICAgIHRhZ3M6IFt7a2V5OiBcIk5hbWVcIiwgdmFsdWU6IFwiaW90LXNlY3VyZS10dW5uZWwtbXVsdGlwbGV4LWRlbW8tZGV2aWNlXCJ9XSxcbiAgICAgIHVzZXJEYXRhOiBjZGsuRm4uYmFzZTY0KGAjIS9iaW4vYmFzaFxuYXB0LWdldCAteSB1cGRhdGVcbmFwdC1nZXQgLXkgaW5zdGFsbCBidWlsZC1lc3NlbnRpYWwgZysrIHRtdXggbm9kZWpzIG5wbSBnaXQganEgYXdzY2xpXG4gICAgICAgICAgXG5jZCAvaG9tZS91YnVudHVcbnN1IC0gdWJ1bnR1IC1jICdnaXQgY2xvbmUgYCArIGdpdGh1YlJlcG9VcmwudmFsdWVBc1N0cmluZyArIGAnXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8nXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8vZGV2aWNlLWFnZW50ICYmIG5wbSBpbnN0YWxsJ1xuc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vICYmIC4vYmluL2RldmljZS1hZ2VudC9ydW4uc2gnYFxuICAgICAgKVxuICAgIH0pO1xuICAgIFxuICB9XG59Il19