#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
LOCAL_PROXY_PATH=$mydir/../../build/ubuntu18

SAT=$(jq -r ".sourceAccessToken" $IOT_RESOURCES_PATH/tunnel.json)
REGION=$(aws configure get region)
PORTS=HTTP1=5555,SSH1=3333

$LOCAL_PROXY_PATH/localproxy -r $REGION -s $PORTS -t $SAT