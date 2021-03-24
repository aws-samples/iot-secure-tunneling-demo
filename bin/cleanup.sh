#!/bin/bash

mydir="${0%/*}"
CONFIG_PATH=$mydir/../config

# Delete the S3 bucket
echo "################################################################################"
echo '#                          Deleting the S3 bucket ...                          #'
echo "################################################################################"
$mydir/s3/delete.sh
echo ""

# Destroy the stack
echo "################################################################################"
echo '#                           Deleting the Device VPC...                         #'
echo "################################################################################"
($mydir/device-vpc/cleanup.sh)
echo ""

Remove the IoT resources
echo "################################################################################"
echo '#           Cleaning up the Iot Agent resources on AWS IoT Core...             #'
echo "################################################################################"
$mydir/iot/cleanup.sh
echo ""

# Remove the EC2 key pair
echo "################################################################################"
echo '#                         Deleting the EC2 key pair...                         #'
echo "################################################################################"
$mydir/ec2/cleanup.sh
echo ""

# Removing local config directories
rm -rf $CONFIG_PATH/iot
rm -rf $CONFIG_PATH/ec2