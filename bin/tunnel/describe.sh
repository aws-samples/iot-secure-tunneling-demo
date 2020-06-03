#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
TUNNEL_ID=$(jq -r ".tunnelId" $IOT_RESOURCES_PATH/tunnel.json)

echo "Getting tunnel information from AWS IoT..."
aws iotsecuretunneling describe-tunnel \
--tunnel-id $TUNNEL_ID 