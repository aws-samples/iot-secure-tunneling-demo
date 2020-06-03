#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config

# Deleting S3 buccket
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name AwsIotSecTunnelStack | jq -r ".Stacks[0].Outputs[0].OutputValue")
echo "Deleting the S3 bucket..."
aws s3 rb s3://$S3_BUCKET --force
echo "Successfully deleted the S3 bucket"