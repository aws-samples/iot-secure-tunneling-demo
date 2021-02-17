#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
EC2_RESOURCES_PATH=$CONFIG_PATH/ec2

EC2_KEY_NAME=$(jq -r ".KeyName" $EC2_RESOURCES_PATH/key-pair.json)

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
    if [[ "$SOURCE"==*"SSH"* ]] 
    then
        SSH_PORT=`echo $SOURCE | cut -d'=' -f 2`      
    fi
done

ssh -o StrictHostKeyChecking=no \
-o UserKnownHostsFile=/dev/null \
-i $EC2_RESOURCES_PATH/$EC2_KEY_NAME.pem ubuntu@localhost -p $SSH_PORT
