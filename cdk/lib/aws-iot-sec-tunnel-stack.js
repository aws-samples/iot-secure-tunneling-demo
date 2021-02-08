"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsIotSecTunnelStack = void 0;
var fs = require('fs');
var path = require('path');
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const thing = require("./constructs/thing-construct");
const configJson = require("../../config/config.json");
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
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloudFormationReadOnlyAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess')
            ]
        });
        const secureTunnelInstanceProfile = new iam.CfnInstanceProfile(this, 'secureTunnelProfile', {
            roles: [instanceRole.roleName]
        });
        const ubuntuAmi = ec2.MachineImage.lookup({
            name: 'ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20200112',
        }).getImage(this).imageId;
        configJson.things.forEach(thingConfig => {
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
exports.AwsIotSecTunnelStack = AwsIotSecTunnelStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0Isd0NBQXlDO0FBRXpDLHdDQUF5QztBQUN6QyxxQ0FBc0M7QUFDdEMsc0NBQXVDO0FBQ3ZDLHNEQUFzRDtBQUN0RCx1REFBc0Q7QUFFdEQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsU0FBUyxpQ0FBaUMsQ0FBQyxDQUFDO0FBRXZFLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtRQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7S0FBRTtDQUMzQyxDQUFBO0FBRUQsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUVuQyxNQUFhLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pELFlBQVksR0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFMUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBQztZQUNyRCxNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2hFLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLG1EQUFtRDtZQUNoRSxPQUFPLEVBQUUsOERBQThEO1NBQ3hFLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsaUJBQWlCLEVBQ3hEO1lBQ0UsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO1lBQ3hELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLGtDQUFrQyxDQUFDO2dCQUM5RSxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLGlDQUFpQyxDQUFDO2dCQUM3RSxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLHlCQUF5QixDQUFDO2FBQ3RFO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBRSxJQUFJLEVBQUMscUJBQXFCLEVBQUM7WUFDdkYsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztTQUNqQyxDQUFDLENBQUE7UUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLEVBQUUsaUVBQWlFO1NBQ3hFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRTFCLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQSxFQUFFO1lBRXJDLG9DQUFvQztZQUNwQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3pDLGNBQWMsRUFBRSxTQUFTO2dCQUN6QixHQUFHLEVBQUUsU0FBUztnQkFDZCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFJO2dCQUMzQixlQUFlLEVBQUUsMkJBQTJCO2dCQUM1QyxhQUFhLEVBQUUsYUFBYSxDQUFDLGFBQWE7Z0JBQzFDLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUzthQUNqQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUVoRSxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsUUFBUSxDQUFDLFVBQVU7WUFDMUIsV0FBVyxFQUFFLGdFQUFnRTtTQUM5RSxDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUF0REQsb0RBc0RDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lYzInKTtcbmltcG9ydCB7SW5zdGFuY2VDbGFzcyxJbnN0YW5jZVNpemUsSW5zdGFuY2VUeXBlfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCBpYW0gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtaWFtJyk7XG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IHMzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXMzJyk7XG5pbXBvcnQgdGhpbmcgPSByZXF1aXJlKCcuL2NvbnN0cnVjdHMvdGhpbmctY29uc3RydWN0JylcbmltcG9ydCAqIGFzIGNvbmZpZ0pzb24gZnJvbSBcIi4uLy4uL2NvbmZpZy9jb25maWcuanNvblwiXG5cbmxldCBrZXlDb25maWcgPSByZXF1aXJlKGAke19fZGlybmFtZX0vLi4vLi4vY29uZmlnL2VjMi9rZXktcGFpci5qc29uYCk7XG5cbmNvbnN0IEVOVl9QUk9QUyA9IHtcbiAgZW52OiB7IFxuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfVxufVxuXG5jb25zdCBLRVlfTkFNRSA9IGtleUNvbmZpZy5LZXlOYW1lO1xuXG5leHBvcnQgY2xhc3MgQXdzSW90U2VjVHVubmVsU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihhcHAsIGlkLCBFTlZfUFJPUFMpO1xuICAgIFxuICAgIGxldCBkZXZpY2VWcGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnaW90U2VjdXJlVHVubmVsaW5nJyx7XG4gICAgICBtYXhBenM6IDIsXG4gICAgfSk7ICBcbiAgICBcbiAgICBjb25zdCBnaXRodWJSZXBvVXJsID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIodGhpcywgJ2dpdGh1YlJlcG9VcmwnLCB7XG4gICAgICB0eXBlOiBcIlN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGxvY2F0aW9uIG9mIHRoZSBHaXRodWIgcmVwbyB1c2VkIGZvciB0aGUgZGVtb1wiLFxuICAgICAgZGVmYXVsdDogXCJodHRwczovL2dpdGh1Yi5jb20vYXdzLXNhbXBsZXMvaW90LXNlY3VyZS10dW5uZWxpbmctZGVtby5naXRcIlxuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IGluc3RhbmNlUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCdzc21pbnN0YW5jZXJvbGUnLFxuICAgIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FtYXpvbkVDMlJvbGVmb3JTU00nKSxcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NDbG91ZEZvcm1hdGlvblJlYWRPbmx5QWNjZXNzJyksXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUMyUmVhZE9ubHlBY2Nlc3MnKVxuICAgICAgXVxuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHNlY3VyZVR1bm5lbEluc3RhbmNlUHJvZmlsZSA9IG5ldyBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlKCB0aGlzLCdzZWN1cmVUdW5uZWxQcm9maWxlJyx7XG4gICAgICAgIHJvbGVzOiBbaW5zdGFuY2VSb2xlLnJvbGVOYW1lXVxuICAgIH0pXG5cbiAgICBjb25zdCB1YnVudHVBbWkgPSBlYzIuTWFjaGluZUltYWdlLmxvb2t1cCh7XG4gICAgICBuYW1lOiAndWJ1bnR1L2ltYWdlcy9odm0tc3NkL3VidW50dS1iaW9uaWMtMTguMDQtYW1kNjQtc2VydmVyLTIwMjAwMTEyJyxcbiAgICB9KS5nZXRJbWFnZSh0aGlzKS5pbWFnZUlkO1xuICAgIFxuICAgIGNvbmZpZ0pzb24udGhpbmdzLmZvckVhY2godGhpbmdDb25maWc9PiB7XG4gICAgICBcbiAgICAgIC8qIGNyZWF0ZSB0aGluZyB0aHJvdWdoIGNvbnN0cnVjdCAqL1xuICAgICAgbmV3IHRoaW5nLklvdFRoaW5nKHRoaXMsIHRoaW5nQ29uZmlnLm5hbWUsIHtcbiAgICAgICAgbWFjaGluZUltYWdlSWQ6IHVidW50dUFtaSxcbiAgICAgICAgdnBjOiBkZXZpY2VWcGMsXG4gICAgICAgIGtleU5hbWU6IEtFWV9OQU1FLFxuICAgICAgICB0aGluZ05hbWU6IHRoaW5nQ29uZmlnLm5hbWUsXG4gICAgICAgIGluc3RhbmNlUHJvZmlsZTogc2VjdXJlVHVubmVsSW5zdGFuY2VQcm9maWxlLFxuICAgICAgICBnaXRodWJSZXBvVXJsOiBnaXRodWJSZXBvVXJsLnZhbHVlQXNTdHJpbmcsXG4gICAgICAgIHJlc291cmNlczogdGhpbmdDb25maWcucmVzb3VyY2VzXG4gICAgICB9KTsgIFxuICAgIH0pO1xuICAgIFxuICAgIGxldCBzM0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ2F3cy1zZWN1cmUtdHVubmVsaW5nLWRlbW8nKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdzM0J1Y2tldE5hbWUnLCB7XG4gICAgICB2YWx1ZTogczNCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUzMgYnVja2V0IHRoYXQgd2lsbCBob2xkIHNvbWUgb2JqZWN0cyBuZWVkZWQgdG8gcnVuIHRoaXMgZGVtby4nXG4gICAgfSk7XG4gICAgXG4gIH1cbn0iXX0=