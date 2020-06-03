#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
TUNNEL_ID=$(jq -r ".tunnelId" $IOT_RESOURCES_PATH/tunnel.json)

echo "[1/2] Deleting tunnel from AWS IoT..."
aws iotsecuretunneling close-tunnel \
--tunnel-id $TUNNEL_ID --delete
rm $IOT_RESOURCES_PATH/tunnel.json

# Uploading tunnel info S3
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "[2/2] Removing tunnel configuration from s3..."
aws s3 sync $CONFIG_PATH s3://$S3_BUCKET --delete --quiet
