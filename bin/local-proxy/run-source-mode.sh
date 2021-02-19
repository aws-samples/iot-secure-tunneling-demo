#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources

LOCAL_PROXY_PATH=$mydir/../../build/ubuntu18
OS_TYPE=`uname -r`
if [[ $OS_TYPE =~ "amzn2" ]]; then
    LOCAL_PROXY_PATH=$mydir/../../build/amzn2
fi

read -p "Enter the thing name [secure-tunnel-demo]: " THING_NAME
THING_NAME=${THING_NAME:-secure-tunnel-demo}


CONFIG_JSON_PATH=$CONFIG_PATH/config.json
THING_SOURCES=`jq -r '.things[] | select(.name == "'$THING_NAME'") | .secureTunnelSources' $CONFIG_JSON_PATH`
if [ -z $THING_SOURCES ]
then
    echo "Configuration for thing: '$THING_NAME' not found in $CONFIG_JSON_PATH"
    exit 
fi

SAT=$(jq -r ".sourceAccessToken" $IOT_RESOURCES_PATH/$THING_NAME/tunnel.json)
REGION=$(aws configure get region)

$LOCAL_PROXY_PATH/localproxy -r $REGION -s $THING_SOURCES -t $SAT
