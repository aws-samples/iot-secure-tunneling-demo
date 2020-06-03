#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config

# Download config files from S3
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "Downloading configuration files from s3..."
aws s3 sync s3://$S3_BUCKET $CONFIG_PATH --delete --quiet

echo "Successfully downloaded all configurations from S3"