# 4. Testing the AWS IoT Secure Tunneling Multiplex Demo [OPTIONAL]

## Close the existing tunnel

If you still have the tunnel open from the previous exercise, you can easily close this by closing the terminal window.  We will want to establish a new tunnel to our second device that contains both the local proxy and a local API.

The first step will be to create the tunnel on AWS IoT Core. The picture below illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex0.png)

1. We will run a script on Cloud9, to create the tunnel on AWS IoT Core.
2. Once the tunnel is created, the device that is subscribed to a specific MQTT topic will receive a notification with the client access token (CAT).
3. It will use the CAT to run the local proxy on destination mode.
4. That will stablish the destination connection with the tunnel.

## Create the tunnel

Let's get started. Run the following command to create the tunnel:
```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/create.sh 
```

Type in *secure-tunnel-demo-multiplex* and press *Enter* when prompted to enter thing name.

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex1.gif)

Run the following command to check the tunnel status.
```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/describe.sh 
```
Type in *secure-tunnel-demo-multiplex* and press *Enter* when prompted to enter thing name.

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex2.gif)

The destinationConnectionState status should be CONNECTED, because our device was subscribing to the MQTT topic that AWS IoT publishes on whenever a tunnel is created. Once the device received that notification, it uses the tunnel CAT to run the localproxy in destination mode and connect to the tunnel.

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex3.png)

## Run the local proxy in source mode

Now, what we will do is run the local proxy in source mode on Cloud9. The picture below illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test_multiplex/test_multiplex1.png)

1. We run the local proxy in source mode. The proxy will listen for local connections on port 5555.
2. The proxy connects to the tunnel.

```
cd ~/environment/iot-secure-tunneling/
./bin/local-proxy/run-source-mode.sh
```

Type in *secure-tunnel-demo-multiplex* and press *Enter* when prompted to enter thing name.

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex3.gif)

At this point, the sourceConnectionState status should be CONNECTED as well. Open a new terminal windown on Cloud9 (the current one is running the local proxy in source mode) and run the following command to check it:

Type in *secure-tunnel-demo-multiplex* and press *Enter* when prompted to enter thing name.

```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/describe.sh 
```

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex4.gif)

The destination status was already connected, but after you ran the localproxy in source mode, the source status should also show as connected:

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex4.png)


## Choosing a Destination Connection on IoT Device
Now that we've established connectivity, we can either connect via SSH or HTTP as we see available in our destinationConfig section.  The [Ssh to the Device](#ssh-to-the-device) will walk you through on how to connect to SSH1 and the [Curl to the Device](#curl-to-the-device) section will walk you how to connect to the HTTP1 connection.  

## Ssh to the Device
We can finally ssh to the device. The picture bellow illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex1.png)

1. On the Cloud9 environment, we **ssh to localhost on port 5555**, because that is the port the local proxy is listening on locally.
2. The tunnel enables the ssh connection to the device.
3. Once the request arrives on the local proxy running in destination mode on the device, it is forwarded to the local ssh daemons running on port 22.

On the second terminal windown on Cloud9 (the first one is running the local proxy in source mode) and run the following command:

Type in *secure-tunnel-demo-multiplex* and press *Enter* when prompted to enter thing name.

```
cd ~/environment/iot-secure-tunneling/
./bin/ssh/connect.sh
pwd
ls
cd iot-secure-tunneling-demo
tail -100 logs/device-agent.log
exit
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex5.gif)


## Curl to the device
We can additionally curl to the device.  Not only do we have an SSH port that we can connect to, we've opened an additional port and built an API to pull device information.  

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex2.png)

1. On the Cloud9 environment, we **curl to localhost on port 3333**, because that is the port the local proxy is listening on locally for our node API.
2. The tunnel enables the api connection to the device.
3. Once the request arrives on the local proxy running in destination mode on the device, it is forwarded to the local ssh daemons running on port 8089.

On the second terminal windown on Cloud9 (the first one is running the local proxy in source mode) and run the following command:

```
curl http://localhost:3333/device/mem | jq .
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test-multiplex/test_multiplex6.gif)


Congratulations, you have successfully run the demo. Once you are done with it, make sure to go to the next step to clean up your AWS resources.

[Back: 3. Test the Demo](./test.md)  |  [Next: 5. Cleaning Up](./cleanup.md)
