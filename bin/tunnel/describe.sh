#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config

read -p "Enter the thing name [secure-tunnel-demo]: " THING_NAME
THING_NAME=${THING_NAME:-secure-tunnel-demo}

THING_TUNNEL_PATH=$CONFIG_PATH/iot/resources/$THING_NAME/tunnel.json
if test -f $THING_TUNNEL_PATH
then

    TUNNEL_ID=$(jq -r ".tunnelId" $THING_TUNNEL_PATH)

    echo "Getting tunnel information from AWS IoT..."
    aws iotsecuretunneling describe-tunnel \
    --tunnel-id $TUNNEL_ID 

else
    echo "$THING_TUNNEL_PATH file does not exist."
fi



