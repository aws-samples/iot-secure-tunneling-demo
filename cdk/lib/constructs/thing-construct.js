"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotThing = void 0;
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const constructs_1 = require("constructs");
class IotThing extends constructs_1.Construct {
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
                `su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo/` + resource + ` && npm install\n'
                su - ubuntu -c 'cd /home/ubuntu/iot-secure-tunneling-demo && ./bin/` + resource + `/run.sh'\n`;
        });
        const thing = new ec2.CfnInstance(this, props.thingName, {
            imageId: props.machineImageId,
            instanceType: 'c6g.medium',
            iamInstanceProfile: props.instanceProfile.ref,
            keyName: props.keyName,
            subnetId: props.vpc.publicSubnets[0].subnetId,
            tags: [{ key: "Name", value: props.thingName }],
            userData: cdk.Fn.base64(userData)
        });
    }
}
exports.IotThing = IotThing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpbmctY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGhpbmctY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsMkNBQXVDO0FBYXZDLE1BQWEsUUFBUyxTQUFRLHNCQUFTO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLFFBQVEsR0FBRzs7Ozs7dUNBS2dCLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRzt1RUFDTyxDQUFBO1FBRS9ELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLFFBQVEsR0FBRyxRQUFRO2dCQUNmLDREQUE0RCxHQUFHLFFBQVEsR0FBRztvRkFDTixHQUFHLFFBQVEsR0FBRyxZQUFZLENBQUE7UUFDdEcsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDckQsT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQzdCLFlBQVksRUFBRSxZQUFZO1lBQzFCLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRztZQUM3QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7WUFDN0MsSUFBSSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFDLENBQUM7WUFDN0MsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUNwQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUE1QkQsNEJBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElvdFRoaW5nUHJvcHMge1xuICAgIG1hY2hpbmVJbWFnZUlkOiBzdHJpbmc7XG4gICAgaW5zdGFuY2VQcm9maWxlOiBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlO1xuICAgIHZwYzogZWMyLlZwYztcbiAgICBrZXlOYW1lOiBzdHJpbmc7XG4gICAgdGhpbmdOYW1lOiBzdHJpbmc7XG4gICAgcmVzb3VyY2VzOiBzdHJpbmdbXVxuICAgIGdpdGh1YlJlcG9Vcmw6IHN0cmluZztcbn1cblxuXG5leHBvcnQgY2xhc3MgSW90VGhpbmcgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJb3RUaGluZ1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgdXNlckRhdGEgPSBgIyEvYmluL2Jhc2hcbiAgICAgICAgICAgIGFwdC1nZXQgLXkgdXBkYXRlXG4gICAgICAgICAgICBhcHQtZ2V0IC15IGluc3RhbGwgYnVpbGQtZXNzZW50aWFsIGcrKyB0bXV4IG5vZGVqcyBucG0gZ2l0IGpxIGF3c2NsaVxuICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY2QgL2hvbWUvdWJ1bnR1XG4gICAgICAgICAgICBzdSAtIHVidW50dSAtYyAnZ2l0IGNsb25lIGAgKyBwcm9wcy5naXRodWJSZXBvVXJsICsgYCdcbiAgICAgICAgICAgIHN1IC0gdWJ1bnR1IC1jICdjZCAvaG9tZS91YnVudHUvaW90LXNlY3VyZS10dW5uZWxpbmctZGVtbydgXG4gICAgICAgIFxuICAgICAgICBwcm9wcy5yZXNvdXJjZXMuZm9yRWFjaChyZXNvdXJjZSA9PiB7XG4gICAgICAgICAgICB1c2VyRGF0YSA9IHVzZXJEYXRhICsgXG4gICAgICAgICAgICAgICAgYHN1IC0gdWJ1bnR1IC1jICdjZCAvaG9tZS91YnVudHUvaW90LXNlY3VyZS10dW5uZWxpbmctZGVtby9gICsgcmVzb3VyY2UgKyBgICYmIG5wbSBpbnN0YWxsXFxuJ1xuICAgICAgICAgICAgICAgIHN1IC0gdWJ1bnR1IC1jICdjZCAvaG9tZS91YnVudHUvaW90LXNlY3VyZS10dW5uZWxpbmctZGVtbyAmJiAuL2Jpbi9gICsgcmVzb3VyY2UgKyBgL3J1bi5zaCdcXG5gICAgIFxuICAgICAgICB9KVxuICAgICAgXG4gICAgICAgIGNvbnN0IHRoaW5nID0gbmV3IGVjMi5DZm5JbnN0YW5jZSh0aGlzLCBwcm9wcy50aGluZ05hbWUsIHtcbiAgICAgICAgICAgIGltYWdlSWQ6IHByb3BzLm1hY2hpbmVJbWFnZUlkLFxuICAgICAgICAgICAgaW5zdGFuY2VUeXBlOiAnYzZnLm1lZGl1bScsXG4gICAgICAgICAgICBpYW1JbnN0YW5jZVByb2ZpbGU6IHByb3BzLmluc3RhbmNlUHJvZmlsZS5yZWYsXG4gICAgICAgICAgICBrZXlOYW1lOiBwcm9wcy5rZXlOYW1lLFxuICAgICAgICAgICAgc3VibmV0SWQ6IHByb3BzLnZwYy5wdWJsaWNTdWJuZXRzWzBdLnN1Ym5ldElkLFxuICAgICAgICAgICAgdGFnczogW3trZXk6IFwiTmFtZVwiLCB2YWx1ZTogcHJvcHMudGhpbmdOYW1lfV0sXG4gICAgICAgICAgICB1c2VyRGF0YTogY2RrLkZuLmJhc2U2NCh1c2VyRGF0YSlcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19