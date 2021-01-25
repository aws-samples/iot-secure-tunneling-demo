#!/bin/bash
mydir="${0%/*}"
DEVICE_API_PATH=$mydir/../../device-api
LOG_PATH=$mydir/../../logs

# Run the device API
nohup node $DEVICE_API_PATH/src/index.js >> $LOG_PATH/device-api.log 2>&1 &
