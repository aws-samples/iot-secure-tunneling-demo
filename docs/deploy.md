# 1. Deploying the AWS IoT Secure Tunneling Demo

Follow the steps bellow to deploy the demo on your AWS account. Leverage [AWS CloudShell](https://aws.amazon.com/cloudshell/).  If this is your first time to use AWS CloudShell it may take a few minutes to initialize.

## CloudShell First-Time Use
You will want to set your AWS region (however you will not need to provide your AWS access key ID or secret access key).

```
aws configure
```

For example, if you are using the us-east-1 type 'us-east-1' when prompted.   

## Installing the prerequisites
In AWS CloudShell, type the following commands to setup your environment:
```
npm update -g
npm install -g aws-cdk
sudo yum install -y jq
sudo yum install -y libatomic
sudo yum install -y openssl11-devel
```
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy1.gif)

## Cloning our repo
You must also clone our GitHub repo:
```
git clone https://github.com/blakewell/iot-secure-tunneling-demo.git iot-secure-tunneling
```
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy2.gif)

## Deploying the demo
Finally, run the following command in order to depoy the demo:
```
cd ~/environment/iot-secure-tunneling/
./bin/deploy.sh
```
![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy3.gif)

## AWS resources created

After the script runs, you should see as the last line of the command output: **Successfully deployed the demo**. You now have all the AWS resources needed to run this demo. The picture bellow illustrates that:

![](https://github.com/blakewell/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy4.png)


[Back: 1. Prerequisites](./prereqs.md)  |  [Next: 3. Testing the demo](./test.md)
