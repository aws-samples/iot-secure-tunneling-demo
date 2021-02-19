# AWS IoT Secure Tunneling Demo

The intent of this demo is to enable you to quickly test the [AWS IoT Secure Tunneling feature](https://docs.aws.amazon.com/iot/latest/developerguide/secure-tunneling.html). 

On this demo, you will establish bidirectional communication to remote devices over a secure connection that is managed by AWS IoT. Secure tunneling does not require updates to your existing inbound firewall rule, so you can keep the same security level provided by firewall rules at a remote site. The picture below illustrate how this demo works:

![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/demo-overall-arch.png)

1. First, we will create an AWS Cloud9 environment, from where you will run this demo.
2. We will use the AWS CLI to provision the AWS IoT Core resources needed for this workshop: an iot thing, certificate and policy.
3. We will use the AWS Cloud Development Kit (CDK) to deploy the device VPC with an EC2 instance running the device agent and the local proxy.
4. When the EC2 instance starts, it automatically runs the device agent. The agent leverages the AWS IoT Device SDK For JS to subscribe to a specific MQTT topic on AWS IoT Core. The device uses that MQTT subscription to receive notificatios about any AWS IoT Tunnel created with that device as a target.

# Getting started

To get started, please follow theese instructions:

1. [Deploying the demo](./docs/deploy.md)
2. [Testing the demo](./docs/test.md)
3. [Optional: Testing the multiplex demo](./docs/test-multiplex.md)
4. [Cleaning up](./docs/cleanup.md)

# License

This library is licensed under the MIT-0 License. See the LICENSE file.

