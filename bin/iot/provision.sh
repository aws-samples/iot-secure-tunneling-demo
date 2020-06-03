#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
IOT_CERTS_PATH=$CONFIG_PATH/iot/certs
mkdir -p $IOT_RESOURCES_PATH
mkdir -p $IOT_CERTS_PATH

read -p "Enter the thing name [secure-tunnel-demo]: " THING_NAME
THING_NAME=${THING_NAME:-secure-tunnel-demo}

aws iot describe-endpoint --endpoint-type iot:Data-ATS > $IOT_RESOURCES_PATH/endpoint.json

# create a thing in the thing registry
echo "[1/6] Creating thing ${THING_NAME}..."
aws iot create-thing --thing-name $THING_NAME  > $IOT_RESOURCES_PATH/thing.json

# create key and certificate for your device and active the device
echo "[2/6] Creating keys and certs..."
aws iot create-keys-and-certificate --set-as-active \
--public-key-outfile $IOT_CERTS_PATH/$THING_NAME.public.key \
--private-key-outfile $IOT_CERTS_PATH/$THING_NAME.private.key \
--certificate-pem-outfile $IOT_CERTS_PATH/$THING_NAME.certificate.pem > $IOT_RESOURCES_PATH/certs.json

# output values from the previous call needed in further steps
CERTIFICATE_ARN=$(jq -r ".certificateArn" $IOT_RESOURCES_PATH/certs.json)
CERTIFICATE_ID=$(jq -r ".certificateId" $IOT_RESOURCES_PATH/certs.json)

# create an IoT policy
POLICY_NAME=${THING_NAME}-policy
echo "[3/6] Creating the policy ${POLICY_NAME}..."
aws iot create-policy --policy-name $POLICY_NAME \
--policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action": "iot:*","Resource":"*"}]}' \
> $IOT_RESOURCES_PATH/policy.json

# attach the policy to your certificate
echo "[4/6] Attaching ${POLICY_NAME} to certificate..."
aws iot attach-policy --policy-name $POLICY_NAME \
--target $CERTIFICATE_ARN

# attach the certificate to your thing
echo "[5/6] Attaching certificate to ${THING_NAME}..."
aws iot attach-thing-principal --thing-name $THING_NAME \
--principal $CERTIFICATE_ARN

# get Amazon root CAs
# Get the CA certificates which could be used to sign
# AWS IoT server certificates
# See also: https://docs.aws.amazon.com/iot/latest/developerguide/managing-device-certs.html 
echo "[6/6] Getting Amazon root CA certificates..."
ROOT_CA_FILE=$IOT_CERTS_PATH/root.ca.bundle.pem
cp /dev/null $ROOT_CA_FILE

for ca in \
    https://www.amazontrust.com/repository/AmazonRootCA1.pem \
    https://www.amazontrust.com/repository/AmazonRootCA2.pem \
    https://www.amazontrust.com/repository/AmazonRootCA3.pem \
    https://www.amazontrust.com/repository/AmazonRootCA4.pem; do

    wget --quiet -O - $ca >> $ROOT_CA_FILE

done

echo "Successfully provisioned all AWS IoT resources"



