#!/bin/bash
mydir="${0%/*}"

CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources

read -p "Enter the thing name [secure-tunnel-demo]: " THING_NAME
THING_NAME=${THING_NAME:-secure-tunnel-demo}

CONFIG_JSON_PATH=$CONFIG_PATH/config.json
THING_SOURCES=`jq -r '.things[] | select(.name == "'$THING_NAME'") | .secureTunnelSources' $CONFIG_JSON_PATH`
if [ -z $THING_SOURCES ]
then
    echo "Configuration for thing: '$THING_NAME' not found in $CONFIG_JSON_PATH"
    exit 
fi

IFS=',' read -r -a SOURCES <<< $THING_SOURCES
for SOURCE in "${SOURCES[@]}"
do
    SERVICE=`echo $SOURCE | cut -d'=' -f 1`
    if [ -z $ALL_SERVICES ] 
    then
        ALL_SERVICES=$SERVICE    
    else
        ALL_SERVICES="$ALL_SERVICES,$SERVICE"
    fi
done

# Creating tunnel
echo "[1/2] Creating tunnel on AWS IoT..."
aws iotsecuretunneling open-tunnel \
--destination-config thingName=$THING_NAME,services=$ALL_SERVICES \
> $IOT_RESOURCES_PATH/$THING_NAME/tunnel.json

# Uploading tunnel info S3
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "[2/2] Uploading tunnel configuration to s3..."
aws s3 sync $CONFIG_PATH s3://$S3_BUCKET --delete --quiet
