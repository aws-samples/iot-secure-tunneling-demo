#!/bin/bash
mydir="${0%/*}"

CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
THING_NAME=$(jq -r ".thingName" $IOT_RESOURCES_PATH/thing.json)

# Creating tunnel
echo "[1/2] Creating tunnel on AWS IoT..."
aws iotsecuretunneling open-tunnel \
--destination-config thingName=$THING_NAME,services=HTTP1,SSH1 \
> $IOT_RESOURCES_PATH/tunnel.json

# Uploading tunnel info S3
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "[2/2] Uploading tunnel configuration to s3..."
aws s3 sync $CONFIG_PATH s3://$S3_BUCKET --delete --quiet
