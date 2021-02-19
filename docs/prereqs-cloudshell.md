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
sudo yum install -y jq
sudo yum install -y libatomic
sudo yum install -y openssl11-devel
```