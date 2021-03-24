# 3. Testing the AWS IoT Secure Tunneling Demo

Now that we have all the demo infrastructure (Cloud9 environment, device VPC, device EC2 instance and IoT resources) setup, we can finally test the AWS IoT Secure Tunneling.

The first step will be to create the tunnel on AWS IoT Core. The picture below illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test1.png)

1. We will run a script on Cloud9, to create the tunnel on AWS IoT Core.
2. Once the tunnel is created, the device that is subscribed a specific MQTT topic will receive a notification with the client access token (CAT).
3. It will use the CAT to run the local proxy on destination mode.
4. That will stablish the destination connection with the tunnel.

## Verify Device is Running

Go to **AWS IoT Core -> Test -> MQTT test client** and subscribe to the following topic

```
secure-tunnel-demo/ping/secure-tunnel-demo
```

After about 60-120 seconds, you should see a response that looks like this:

```
{
  "msg": "I am up and running"
}
```

This verifies that your device is up and running.

## Create the tunnel

Let's get started. Run the following command to create the tunnel:
```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/create.sh 
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test1.gif)

Run the following command to check the tunnel status.
```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/describe.sh 
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test2.gif)

The destinationConnectionState status should be CONNECTED, because our device was subscribing to the MQTT topic that AWS IoT publishes on whenever a tunnel is created. Once the device received that notification, it uses the tunnel CAT to run the localproxy in destination mode and connect to the tunnel.

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test4.png)

## Run the local proxy in source mode

Now, what we will do is run the local proxy in source mode on Cloud9. The picture below illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test2.png)

1. We run the local proxy in source mode. The proxy will listen for local connections on port 5555.
2. The proxy connects to the tunnel.

```
cd ~/environment/iot-secure-tunneling/
./bin/local-proxy/run-source-mode.sh
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test3.gif)

At this point, the sourceConnectionState status should be CONNECTED as well. Open a new terminal windown on Cloud9 (the current one is running the local proxy in source mode) and run the following command to check it:

```
cd ~/environment/iot-secure-tunneling/
./bin/tunnel/describe.sh 
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test4.gif)

The destination status was already connected, but after you ran the localproxy in source mode, the source status should also show as connected:

![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test5.png)


## Ssh to the Device
We can finally ssh to the device. The picture bellow illustrates the process:
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test3.png)

1. On the Cloud9 environment, we **ssh to localhost on port 5555**, because that is the port the local proxy is listening on locally.
2. The tunnel enables the ssh connection to the device.
3. Once the request arrives on the local proxy running in destination mode on the device, it is forwarded to the local ssh daemons running on port 22.

On the second terminal windown on Cloud9 (the first one is running the local proxy in source mode) and run the following command:

```
cd ~/environment/iot-secure-tunneling/
./bin/ssh/connect.sh
pwd
ls
cd iot-secure-tunneling-demo
tail -100 logs/device-agent.log
exit
```
![](https://github.com/aws-samples/iot-secure-tunneling-demo/blob/docs/imgs/test/test5.gif)

Congratulations, you successfully run the demo. Once you are done with it, you can run the optional multi-plex environment or clean up the environment.

[Back: 2. Deploying the demo](./deploy.md)  |  [Optional: 4. Test Multiplex](./test-multiplex.md) | [Next: 5. Cleaning Up](./cleanup.md)
