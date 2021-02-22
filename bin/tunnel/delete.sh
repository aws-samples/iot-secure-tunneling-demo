#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources

THINGS=($(jq -r '.things[].name' ./config/config.json)) 
for THING in "${THINGS[@]}"
do
    THING_TUNNEL_PATH=$IOT_RESOURCES_PATH/$THING/tunnel.json
    if test -f $THING_TUNNEL_PATH
    then
    
        TUNNEL_ID=$(jq -r ".tunnelId" $THING_TUNNEL_PATH)
    
        echo "Deleting tunnel from AWS IoT for $THING"
        aws iotsecuretunneling close-tunnel \
        --tunnel-id $TUNNEL_ID --delete
        
        rm $THING_TUNNEL_PATH
    else
        echo "$THING tunnel file does not exist."
    fi
    
done

# Uploading tunnel info S3
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "[2/2] Removing tunnel configuration from s3..."
aws s3 sync $CONFIG_PATH s3://$S3_BUCKET --delete --quiet
