"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotThing = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
class IotThing extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        let userData = `#!/bin/bash
            apt-get -y update
            apt-get -y install build-essential g++ tmux nodejs npm git jq awscli
                      
            cd /home/ubuntu
            su - ubuntu -c 'git clone ` + props.githubRepoUrl + `'
            su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo'`;
        props.resources.forEach(resource => {
            userData = userData +
                `su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/` + resource + ` && npm install'
                su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/` + resource + `/run.sh'`;
        });
        const thing = new ec2.CfnInstance(this, props.thingName, {
            imageId: props.machineImageId,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.BURSTABLE2, aws_ec2_1.InstanceSize.MICRO).toString(),
            iamInstanceProfile: props.instanceProfile.ref,
            keyName: props.keyName,
            subnetId: props.vpc.publicSubnets[0].subnetId,
            tags: [{ key: "Name", value: props.thingName }],
            userData: cdk.Fn.base64(userData)
        });
    }
}
exports.IotThing = IotThing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpbmctY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGhpbmctY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBeUM7QUFDekMsOENBQXlFO0FBY3pFLE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBQ3ZDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLFFBQVEsR0FBRzs7Ozs7dUNBS2dCLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRzt1RUFDTyxDQUFBO1FBRS9ELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLFFBQVEsR0FBRyxRQUFRO2dCQUNmLDREQUE0RCxHQUFHLFFBQVEsR0FBRztvRkFDTixHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUE7UUFDcEcsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDckQsT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQzdCLFlBQVksRUFBRSxzQkFBWSxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLFVBQVUsRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUN0RixrQkFBa0IsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUc7WUFDN0MsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1lBQzdDLElBQUksRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBQyxDQUFDO1lBQzdDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDcEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBNUJELDRCQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBlYzIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWMyJyk7XG5pbXBvcnQge0luc3RhbmNlQ2xhc3MsSW5zdGFuY2VTaXplLEluc3RhbmNlVHlwZX0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElvdFRoaW5nUHJvcHMge1xuICAgIG1hY2hpbmVJbWFnZUlkOiBzdHJpbmc7XG4gICAgaW5zdGFuY2VQcm9maWxlOiBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlO1xuICAgIHZwYzogZWMyLlZwYztcbiAgICBrZXlOYW1lOiBzdHJpbmc7XG4gICAgdGhpbmdOYW1lOiBzdHJpbmc7XG4gICAgcmVzb3VyY2VzOiBzdHJpbmdbXVxuICAgIGdpdGh1YlJlcG9Vcmw6IHN0cmluZztcbn1cblxuXG5leHBvcnQgY2xhc3MgSW90VGhpbmcgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElvdFRoaW5nUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgXG4gICAgICAgIGxldCB1c2VyRGF0YSA9IGAjIS9iaW4vYmFzaFxuICAgICAgICAgICAgYXB0LWdldCAteSB1cGRhdGVcbiAgICAgICAgICAgIGFwdC1nZXQgLXkgaW5zdGFsbCBidWlsZC1lc3NlbnRpYWwgZysrIHRtdXggbm9kZWpzIG5wbSBnaXQganEgYXdzY2xpXG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjZCAvaG9tZS91YnVudHVcbiAgICAgICAgICAgIHN1IC0gdWJ1bnR1IC1jICdnaXQgY2xvbmUgYCArIHByb3BzLmdpdGh1YlJlcG9VcmwgKyBgJ1xuICAgICAgICAgICAgc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vJ2BcbiAgICAgICAgXG4gICAgICAgIHByb3BzLnJlc291cmNlcy5mb3JFYWNoKHJlc291cmNlID0+IHtcbiAgICAgICAgICAgIHVzZXJEYXRhID0gdXNlckRhdGEgKyBcbiAgICAgICAgICAgICAgICBgc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vL2AgKyByZXNvdXJjZSArIGAgJiYgbnBtIGluc3RhbGwnXG4gICAgICAgICAgICAgICAgc3UgLSB1YnVudHUgLWMgJ2NkIC9ob21lL3VidW50dS9pb3Qtc2VjdXJlLXR1bm5lbGluZy1kZW1vICYmIC4vYmluL2AgKyByZXNvdXJjZSArIGAvcnVuLnNoJ2AgICAgXG4gICAgICAgIH0pXG4gICAgICBcbiAgICAgICAgY29uc3QgdGhpbmcgPSBuZXcgZWMyLkNmbkluc3RhbmNlKHRoaXMsIHByb3BzLnRoaW5nTmFtZSwge1xuICAgICAgICAgICAgaW1hZ2VJZDogcHJvcHMubWFjaGluZUltYWdlSWQsXG4gICAgICAgICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTIsIEluc3RhbmNlU2l6ZS5NSUNSTykudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGlhbUluc3RhbmNlUHJvZmlsZTogcHJvcHMuaW5zdGFuY2VQcm9maWxlLnJlZixcbiAgICAgICAgICAgIGtleU5hbWU6IHByb3BzLmtleU5hbWUsXG4gICAgICAgICAgICBzdWJuZXRJZDogcHJvcHMudnBjLnB1YmxpY1N1Ym5ldHNbMF0uc3VibmV0SWQsXG4gICAgICAgICAgICB0YWdzOiBbe2tleTogXCJOYW1lXCIsIHZhbHVlOiBwcm9wcy50aGluZ05hbWV9XSxcbiAgICAgICAgICAgIHVzZXJEYXRhOiBjZGsuRm4uYmFzZTY0KHVzZXJEYXRhKVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=