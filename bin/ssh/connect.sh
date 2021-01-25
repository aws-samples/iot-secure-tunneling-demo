#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
EC2_RESOURCES_PATH=$CONFIG_PATH/ec2

EC2_KEY_NAME=$(jq -r ".KeyName" $EC2_RESOURCES_PATH/key-pair.json)
PORT=3333

ssh -o StrictHostKeyChecking=no \
-o UserKnownHostsFile=/dev/null \
-i $EC2_RESOURCES_PATH/$EC2_KEY_NAME.pem ubuntu@localhost -p $PORT
