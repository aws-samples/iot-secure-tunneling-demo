# AWS IoT Secure Tunneling Demo

The intent of this demo is to enable you to quickly test the [AWS IoT Secure Tunneling feature](https://docs.aws.amazon.com/iot/latest/developerguide/secure-tunneling.html). 

On this demo, you will establish bidirectional communication to remote devices over a secure connection that is managed by AWS IoT. Secure tunneling does not require updates to your existing inbound firewall rule, so you can keep the same security level provided by firewall rules at a remote site. The picture below illustrates how this demo works:

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/demo-overall-arch.png)

1. We will use the AWS CLI to provision the AWS IoT Core resources needed for this workshop: an IoT thing, certificate and policy.
2. We will use the AWS Cloud Development Kit (CDK v2) to deploy the device VPC with an EC2 instance running the device agent and the local proxy.
3. When the EC2 instance starts, it automatically runs the device agent. The agent leverages the AWS IoT Device SDK for JS to subscribe to a specific MQTT topic on AWS IoT Core. The device uses that MQTT subscription to receive notifications about any AWS IoT Tunnel created with that device as a target.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Infrastructure | AWS CDK v2 (TypeScript) |
| Device Agent | Node.js, AWS SDK v3, aws-iot-device-sdk |
| Device API | Express v5, systeminformation |
| EC2 AMI | Ubuntu 24.04 ARM64 (c6g.medium) |

## Getting started

**Prerequisites:** Node.js 18+, AWS CLI configured, AWS CDK CLI (`npm install -g aws-cdk`)

1. [Prerequisites](./docs/prereqs.md)
2. [Deploying the demo](./docs/deploy.md)
3. [Testing the demo](./docs/test.md)
4. [Optional: Testing the multiplex demo](./docs/test-multiplex.md)
5. [Cleaning up](./docs/cleanup.md)

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
