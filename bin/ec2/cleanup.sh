#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
EC2_RESOURCES_PATH=$CONFIG_PATH/ec2

EC2_KEY_NAME=$(jq -r ".KeyName" $EC2_RESOURCES_PATH/key-pair.json)
echo "Deleting the EC2 key pair $EC2_KEY_NAME..."
aws ec2 delete-key-pair --key-name $EC2_KEY_NAME
rm -rf $EC2_RESOURCES_PATH
echo "Successfully deleted the EC2 key pair"
