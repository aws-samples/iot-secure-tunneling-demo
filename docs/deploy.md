# 2. Deploying the AWS IoT Secure Tunneling Demo

Follow the steps bellow to deploy the demo on your AWS account. You should type the commmands on a terminal windown from your Cloud9 environment.

## Cloning our repo
You must also clone our GitHub repo:
```
git clone https://github.com/aws-samples/iot-secure-tunneling-demo.git iot-secure-tunneling
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy2.gif)

## Deploying the demo
Finally, run the following command in order to depoy the demo:
```
cd ~/iot-secure-tunneling/
./bin/deploy.sh https://github.com/aws-samples/iot-secure-tunneling-demo
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy3.gif)

## AWS resources created

After the script runs, you should see as the last line of the command output: **Successfully deployed the demo**. You now have all the AWS resources needed to run this demo. The picture bellow illustrates that:

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/deploy/deploy4.png)

[Back: 1. Prerequisites](./prereqs.md)  |  [Next: 3. Testing the demo](./test.md)
