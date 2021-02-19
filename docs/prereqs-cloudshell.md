# 1. AWS IoT Secure Tunneling Demo Prerequisites - CloudShell

## CloudShell First-Time Use
You will want to set your AWS region (however you will not need to provide your AWS access key ID or secret access key).

```
aws configure
```

For example, if you are using the us-east-1 type 'us-east-1' when prompted.   

## Installing the prerequisites
In AWS CloudShell, type the following commands to setup your environment:
```
sudo npm update -g
sudo npm install -g aws-cdk
sudo yum install -y libatomic
sudo yum install -y openssl11-devel
```

Please note that the instructions will use *~/environment* which is the root directory for Cloud9 applications.  CloudShell does not use that as a root directory and so you can leave that out of any commands you run.

[Back: index](../README.md)  |  [Next: 2. Deploying the demo](./deploy.md)