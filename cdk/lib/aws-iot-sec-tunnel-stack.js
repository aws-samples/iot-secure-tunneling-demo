"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
su - ubuntu -c 'git clone https://github.com/aws-samples/iot-secure-tunneling-demo.git'
cd /home/ubuntu/iot-secure-tunneling-demo
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && git checkout dev'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/device-agent && npm install'
su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/device-agent/run.sh'`)
        });
        let s3Bucket = new s3.Bucket(this, 'aws-secure-tunneling-demo');
        new cdk.CfnOutput(this, 's3BucketName', {
            value: s3Bucket.bucketName,
            description: 'S3 bucket that will hold some objects needed to run this demo.'
        });
    }
}
exports.AwsIotSecTunnelStack = AwsIotSecTunnelStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQix3Q0FBeUM7QUFDekMsOENBQXlFO0FBQ3pFLHdDQUF5QztBQUN6QyxxQ0FBc0M7QUFDdEMsc0NBQXVDO0FBRXZDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLFNBQVMsaUNBQWlDLENBQUMsQ0FBQztBQUV2RSxNQUFNLFNBQVMsR0FBRztJQUNoQixHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDeEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0tBQUU7Q0FDM0MsQ0FBQTtBQUVELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFFbkMsTUFBYSxvQkFBcUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNqRCxZQUFZLEdBQVksRUFBRSxFQUFVO1FBQ2xDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUM7WUFDckQsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLGlCQUFpQixFQUN4RDtZQUNFLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztZQUN4RCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxrQ0FBa0MsQ0FBQztnQkFDOUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxpQ0FBaUMsQ0FBQzthQUM5RTtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUUsSUFBSSxFQUFDLHFCQUFxQixFQUFDO1lBQ3ZGLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7U0FDakMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDeEMsSUFBSSxFQUFFLGlFQUFpRTtTQUN4RSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQixJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQztZQUM5QyxPQUFPLEVBQUUsU0FBUztZQUNsQixZQUFZLEVBQUUsc0JBQVksQ0FBQyxFQUFFLENBQUMsdUJBQWEsQ0FBQyxVQUFVLEVBQUUsc0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDdEYsa0JBQWtCLEVBQUUsMkJBQTJCLENBQUMsR0FBRztZQUNuRCxPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1lBQzdDLElBQUksRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsK0JBQStCLEVBQUMsQ0FBQztZQUM3RCxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozt1RkFTeUQsQ0FDaEY7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFFaEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO1lBQzFCLFdBQVcsRUFBRSxnRUFBZ0U7U0FDOUUsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBakRELG9EQWlEQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmltcG9ydCBlYzIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWMyJyk7XG5pbXBvcnQge0luc3RhbmNlQ2xhc3MsSW5zdGFuY2VTaXplLEluc3RhbmNlVHlwZX0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCBzMyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zMycpO1xuXG5sZXQga2V5Q29uZmlnID0gcmVxdWlyZShgJHtfX2Rpcm5hbWV9Ly4uLy4uL2NvbmZpZy9lYzIva2V5LXBhaXIuanNvbmApO1xuXG5jb25zdCBFTlZfUFJPUFMgPSB7XG4gIGVudjogeyBcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIH1cbn1cblxuY29uc3QgS0VZX05BTUUgPSBrZXlDb25maWcuS2V5TmFtZTtcblxuZXhwb3J0IGNsYXNzIEF3c0lvdFNlY1R1bm5lbFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IoYXBwOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoYXBwLCBpZCwgRU5WX1BST1BTKTtcbiAgICBsZXQgZGV2aWNlVnBjID0gbmV3IGVjMi5WcGModGhpcywgJ2lvdFNlY3VyZVR1bm5lbGluZycse1xuICAgICAgbWF4QXpzOiAyLFxuICAgIH0pOyAgXG4gICAgY29uc3QgaW5zdGFuY2VSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsJ3NzbWluc3RhbmNlcm9sZScsXG4gICAge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUMyUm9sZWZvclNTTScpLFxuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FXU0Nsb3VkRm9ybWF0aW9uUmVhZE9ubHlBY2Nlc3MnKVxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBzZWN1cmVUdW5uZWxJbnN0YW5jZVByb2ZpbGUgPSBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZSggdGhpcywnc2VjdXJlVHVubmVsUHJvZmlsZScse1xuICAgICAgICByb2xlczogW2luc3RhbmNlUm9sZS5yb2xlTmFtZV1cbiAgICB9KVxuXG4gICAgY29uc3QgdWJ1bnR1QW1pID0gZWMyLk1hY2hpbmVJbWFnZS5sb29rdXAoe1xuICAgICAgbmFtZTogJ3VidW50dS9pbWFnZXMvaHZtLXNzZC91YnVudHUtYmlvbmljLTE4LjA0LWFtZDY0LXNlcnZlci0yMDIwMDExMicsXG4gICAgfSkuZ2V0SW1hZ2UodGhpcykuaW1hZ2VJZDtcbiAgICBsZXQgZGV2aWNlID0gbmV3IGVjMi5DZm5JbnN0YW5jZSh0aGlzLCBcImRldmljZVwiLHtcbiAgICAgIGltYWdlSWQ6IHVidW50dUFtaSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMiwgSW5zdGFuY2VTaXplLk1JQ1JPKS50b1N0cmluZygpLFxuICAgICAgaWFtSW5zdGFuY2VQcm9maWxlOiBzZWN1cmVUdW5uZWxJbnN0YW5jZVByb2ZpbGUucmVmLFxuICAgICAga2V5TmFtZTogS0VZX05BTUUsXG4gICAgICBzdWJuZXRJZDogZGV2aWNlVnBjLnB1YmxpY1N1Ym5ldHNbMF0uc3VibmV0SWQsXG4gICAgICB0YWdzOiBbe2tleTogXCJOYW1lXCIsIHZhbHVlOiBcImlvdC1zZWN1cmUtdHVubmVsLWRlbW8tZGV2aWNlXCJ9XSxcbiAgICAgIHVzZXJEYXRhOiBjZGsuRm4uYmFzZTY0KGAjIS9iaW4vYmFzaFxuYXB0LWdldCAteSB1cGRhdGVcbmFwdC1nZXQgLXkgaW5zdGFsbCBidWlsZC1lc3NlbnRpYWwgZysrIHRtdXggbm9kZWpzIG5wbSBnaXQganEgYXdzY2xpXG4gICAgICAgICAgXG5jZCAvaG9tZS91YnVudHVcbnN1IC0gdWJ1bnR1IC1jICdnaXQgY2xvbmUgaHR0cHM6Ly9naXRodWIuY29tL21hcmNvc29ydGl6L2F3cy1pb3Qtc2VjdXJlLXR1bm5lbGluZy5naXQnXG5jZCAvaG9tZS91YnVudHUvYXdzLWlvdC1zZWN1cmUtdHVubmVsaW5nXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2F3cy1pb3Qtc2VjdXJlLXR1bm5lbGluZyAmJiBnaXQgY2hlY2tvdXQgZGV2J1xuc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9hd3MtaW90LXNlY3VyZS10dW5uZWxpbmcvZGV2aWNlLWFnZW50ICYmIG5wbSBpbnN0YWxsJ1xuc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9hd3MtaW90LXNlY3VyZS10dW5uZWxpbmcgJiYgLi9iaW4vZGV2aWNlLWFnZW50L3J1bi5zaCdgXG4gICAgICApXG4gICAgfSk7XG5cbiAgICBsZXQgczNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdhd3Mtc2VjdXJlLXR1bm5lbGluZy1kZW1vJyk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnczNCdWNrZXROYW1lJywge1xuICAgICAgdmFsdWU6IHMzQnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ1MzIGJ1Y2tldCB0aGF0IHdpbGwgaG9sZCBzb21lIG9iamVjdHMgbmVlZGVkIHRvIHJ1biB0aGlzIGRlbW8uJ1xuICAgIH0pO1xuXG4gIH1cbn0iXX0=