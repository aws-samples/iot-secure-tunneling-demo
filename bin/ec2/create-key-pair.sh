#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
EC2_RESOURCES_PATH=$CONFIG_PATH/ec2
mkdir -p $EC2_RESOURCES_PATH

# Crearing the EC2 key pair to be used on the EC2 instance that will run the device agent.
# We need a key pair in order to SSH to that instance.
EC2_KEY_NAME=secure-tunnel-demo
echo "Creating the EC2 key pair $EC2_KEY_NAME..."
aws ec2 create-key-pair --key-name $EC2_KEY_NAME > $EC2_RESOURCES_PATH/key-pair.json
EC2_KEY_MATERIAL=$(jq -r ".KeyMaterial" $EC2_RESOURCES_PATH/key-pair.json)
echo "$EC2_KEY_MATERIAL" > $EC2_RESOURCES_PATH/$EC2_KEY_NAME.pem
chmod 400 $EC2_RESOURCES_PATH/$EC2_KEY_NAME.pem

echo "Successfully created the EC2 key pair"
