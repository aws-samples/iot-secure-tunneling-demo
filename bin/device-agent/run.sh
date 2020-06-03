#!/bin/bash
mydir="${0%/*}"
CONFIG_PULL_PATH=$mydir/../s3
DEVICE_AGENT_PATH=$mydir/../../device-agent
LOG_PATH=$mydir/../../logs

mkdir -p $LOG_PATH
AWS_DEFAULT_REGION=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq .region -r)
export AWS_DEFAULT_REGION

# Download configs and certs from S3
$CONFIG_PULL_PATH/pull.sh >> $LOG_PATH/device-agent.log 

# Run the device agent
nohup node $DEVICE_AGENT_PATH/src/index.js >> $LOG_PATH/device-agent.log 2>&1 &
