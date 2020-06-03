#!/bin/bash

mydir="${0%/*}"

# Create the IoT resources
echo "################################################################################"
echo '#           Provisioning the Iot Agent resources on AWS IoT Core ...           #'
echo "################################################################################"
$mydir/iot/provision.sh
echo ""

# Create an ec2 key-pair
echo "################################################################################"
echo "#                           Creating the EC2 key pair                          #"
echo "################################################################################"
$mydir/ec2/create-key-pair.sh
echo ""

# Deploy the stack
echo "################################################################################"
echo '#                          Deploying the Device VPC...                         #'
echo "################################################################################"
($mydir/device-vpc/deploy.sh)
echo ""

# Sync all configs to the S3 bucket
echo "################################################################################"
echo '#                  Uploading the demo configuration to S3...                   #'
echo "################################################################################"
$mydir/s3/push.sh
echo ""

echo "Successfully deployed the demo."