# 1. AWS IoT Secure Tunneling Demo Prerequisites

*Note: You can run this demo either with AWS Cloud9 or AWS CloudShell.  If you want to leverage [AWS CloudShell](https://aws.amazon.com/cloudshell/) please use these [setup docs instead](./prereqs-cloudshell).*

## Setup Cloud9 Environment

Before you can start, you have to make sure your AWS Clpoud 9 environment is up and running and current.  Navigate to the Cloud9 console: https://console.aws.amazon.com/cloud9

Once you navigate to the Cloud9 console, click on the create environment button:
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-1.png)
  
Type a name for your environment and click **Next step**:
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-2.png)

**Make sure you choose Ubuntu** as the platform. The reason for that is that this demo provides a copy of the distributables of local-proxy previously built for Ubuntu. Leave all the rest with the default configuration, and click **Next step**:
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-3.png)

Click **Create environment**. After a couple of minutes, your environment should look like the following image:
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-4.png)

(Optional) If you prefer a dark theme, chose the theme in the top menu: **View > Themes > Cloud9 > Cloud 9 Night**.
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-5.png)

During the demo, you will be running commands on your Cloud9 terminal.
<details>
  <summary>Where is my Cloud9 Terminal?</summary>
  
  ![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/cloud9/screenshot-cloud9-6.png)
</details>

## Installing the prerequisites
On your Cloud9 Environment, type the following commands to setup your environment:
```
sudo apt-get install -y jq
npm update -g
```
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy1.gif)

[Back: index](../README.md)  |  [Next: 2. Deploying the demo](./deploy.md)