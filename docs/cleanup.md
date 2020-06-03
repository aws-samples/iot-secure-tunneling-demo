# 4. Cleaning Up the AWS IoT Secure Tunneling Demo

1. On the first terminal window on Cloud9, stop the proxy by typing `Ctrl+C`.

2. Run the following command in order to clean up your AWS account:

```
cd ~/environment/iot-secure-tunneling/
./bin/cleanup.sh 
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/cleanup/cleanup.gif)

3. Delete you Cloud9 environment. Detailed instructions [here](https://docs.aws.amazon.com/cloud9/latest/user-guide/delete-environment.html).

[Back: 3. Testing the demo](./test.md)

