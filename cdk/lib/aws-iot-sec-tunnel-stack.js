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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWlvdC1zZWMtdHVubmVsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0Isd0NBQXlDO0FBQ3pDLDhDQUF5RTtBQUN6RSx3Q0FBeUM7QUFDekMscUNBQXNDO0FBQ3RDLHNDQUF1QztBQUV2QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxTQUFTLGlDQUFpQyxDQUFDLENBQUM7QUFFdkUsTUFBTSxTQUFTLEdBQUc7SUFDaEIsR0FBRyxFQUFFO1FBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1FBQ3hDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQjtLQUFFO0NBQzNDLENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBRW5DLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxHQUFZLEVBQUUsRUFBVTtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQixJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFDO1lBQ3JELE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxpQkFBaUIsRUFDeEQ7WUFDRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7WUFDeEQsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsa0NBQWtDLENBQUM7Z0JBQzlFLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsaUNBQWlDLENBQUM7YUFDOUU7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLDJCQUEyQixHQUFHLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFFLElBQUksRUFBQyxxQkFBcUIsRUFBQztZQUN2RixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQ2pDLENBQUMsQ0FBQTtRQUVGLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUksRUFBRSxpRUFBaUU7U0FDeEUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7WUFDOUMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUFDLHVCQUFhLENBQUMsVUFBVSxFQUFFLHNCQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ3RGLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLEdBQUc7WUFDbkQsT0FBTyxFQUFFLFFBQVE7WUFDakIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtZQUM3QyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLCtCQUErQixFQUFDLENBQUM7WUFDN0QsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7d0ZBUzBELENBQ2pGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBRWhFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtZQUMxQixXQUFXLEVBQUUsZ0VBQWdFO1NBQzlFLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQWpERCxvREFpREMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5pbXBvcnQgZWMyID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjMicpO1xuaW1wb3J0IHtJbnN0YW5jZUNsYXNzLEluc3RhbmNlU2l6ZSxJbnN0YW5jZVR5cGV9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IGlhbSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1pYW0nKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcblxubGV0IGtleUNvbmZpZyA9IHJlcXVpcmUoYCR7X19kaXJuYW1lfS8uLi8uLi9jb25maWcvZWMyL2tleS1wYWlyLmpzb25gKTtcblxuY29uc3QgRU5WX1BST1BTID0ge1xuICBlbnY6IHsgXG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB9XG59XG5cbmNvbnN0IEtFWV9OQU1FID0ga2V5Q29uZmlnLktleU5hbWU7XG5cbmV4cG9ydCBjbGFzcyBBd3NJb3RTZWNUdW5uZWxTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQsIEVOVl9QUk9QUyk7XG4gICAgbGV0IGRldmljZVZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdpb3RTZWN1cmVUdW5uZWxpbmcnLHtcbiAgICAgIG1heEF6czogMixcbiAgICB9KTsgIFxuICAgIGNvbnN0IGluc3RhbmNlUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCdzc21pbnN0YW5jZXJvbGUnLFxuICAgIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FtYXpvbkVDMlJvbGVmb3JTU00nKSxcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NDbG91ZEZvcm1hdGlvblJlYWRPbmx5QWNjZXNzJylcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc2VjdXJlVHVubmVsSW5zdGFuY2VQcm9maWxlID0gbmV3IGlhbS5DZm5JbnN0YW5jZVByb2ZpbGUoIHRoaXMsJ3NlY3VyZVR1bm5lbFByb2ZpbGUnLHtcbiAgICAgICAgcm9sZXM6IFtpbnN0YW5jZVJvbGUucm9sZU5hbWVdXG4gICAgfSlcblxuICAgIGNvbnN0IHVidW50dUFtaSA9IGVjMi5NYWNoaW5lSW1hZ2UubG9va3VwKHtcbiAgICAgIG5hbWU6ICd1YnVudHUvaW1hZ2VzL2h2bS1zc2QvdWJ1bnR1LWJpb25pYy0xOC4wNC1hbWQ2NC1zZXJ2ZXItMjAyMDAxMTInLFxuICAgIH0pLmdldEltYWdlKHRoaXMpLmltYWdlSWQ7XG4gICAgbGV0IGRldmljZSA9IG5ldyBlYzIuQ2ZuSW5zdGFuY2UodGhpcywgXCJkZXZpY2VcIix7XG4gICAgICBpbWFnZUlkOiB1YnVudHVBbWksXG4gICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTIsIEluc3RhbmNlU2l6ZS5NSUNSTykudG9TdHJpbmcoKSxcbiAgICAgIGlhbUluc3RhbmNlUHJvZmlsZTogc2VjdXJlVHVubmVsSW5zdGFuY2VQcm9maWxlLnJlZixcbiAgICAgIGtleU5hbWU6IEtFWV9OQU1FLFxuICAgICAgc3VibmV0SWQ6IGRldmljZVZwYy5wdWJsaWNTdWJuZXRzWzBdLnN1Ym5ldElkLFxuICAgICAgdGFnczogW3trZXk6IFwiTmFtZVwiLCB2YWx1ZTogXCJpb3Qtc2VjdXJlLXR1bm5lbC1kZW1vLWRldmljZVwifV0sXG4gICAgICB1c2VyRGF0YTogY2RrLkZuLmJhc2U2NChgIyEvYmluL2Jhc2hcbmFwdC1nZXQgLXkgdXBkYXRlXG5hcHQtZ2V0IC15IGluc3RhbGwgYnVpbGQtZXNzZW50aWFsIGcrKyB0bXV4IG5vZGVqcyBucG0gZ2l0IGpxIGF3c2NsaVxuICAgICAgICAgIFxuY2QgL2hvbWUvdWJ1bnR1XG5zdSAtIHVidW50dSAtYyAnZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3Mtc2FtcGxlcy9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vLmdpdCdcbmNkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8nXG5zdSAtIHVidW50dSAtYyAnY2QgL2hvbWUvdWJ1bnR1L2lvdC1zZWN1cmUtdHVubmVsaW5nLWRlbW8vZGV2aWNlLWFnZW50ICYmIG5wbSBpbnN0YWxsJ1xuc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vICYmIC4vYmluL2RldmljZS1hZ2VudC9ydW4uc2gnYFxuICAgICAgKVxuICAgIH0pO1xuXG4gICAgbGV0IHMzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnYXdzLXNlY3VyZS10dW5uZWxpbmctZGVtbycpO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ3MzQnVja2V0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBzM0J1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdTMyBidWNrZXQgdGhhdCB3aWxsIGhvbGQgc29tZSBvYmplY3RzIG5lZWRlZCB0byBydW4gdGhpcyBkZW1vLidcbiAgICB9KTtcblxuICB9XG59Il19
