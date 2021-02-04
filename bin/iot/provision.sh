#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config


IOT_RESOURCES_BASE_PATH=$CONFIG_PATH/iot/resources
IOT_CERTS_BASE_PATH=$CONFIG_PATH/iot/certs

mkdir -p $IOT_RESOURCES_BASE_PATH
mkdir -p $IOT_CERTS_BASE_PATH

aws iot describe-endpoint --endpoint-type iot:Data-ATS > $IOT_RESOURCES_BASE_PATH/endpoint.json

create_thing() {
    THING_NAME=$1
    
    IOT_RESOURCES_THING_PATH=$CONFIG_PATH/iot/resources/$THING_NAME
    IOT_CERTS_THING_PATH=$CONFIG_PATH/iot/certs/$THING_NAME
    
    mkdir -p $IOT_CERTS_THING_PATH
    mkdir -p $IOT_RESOURCES_THING_PATH
    
    # create a thing in the thing registry
    echo "Creating thing ${THING_NAME}..."
    aws iot create-thing --thing-name $THING_NAME  > $IOT_RESOURCES_THING_PATH/thing.json
    
    # create key and certificate for your device and active the device
    echo "Creating keys and certs..."
    aws iot create-keys-and-certificate --set-as-active \
    --public-key-outfile $IOT_CERTS_THING_PATH/$THING_NAME.public.key \
    --private-key-outfile $IOT_CERTS_THING_PATH/$THING_NAME.private.key \
    --certificate-pem-outfile $IOT_CERTS_THING_PATH/$THING_NAME.certificate.pem > $IOT_RESOURCES_THING_PATH/certs.json
    
    # output values from the previous call needed in further steps
    CERTIFICATE_ARN=$(jq -r ".certificateArn" $IOT_RESOURCES_THING_PATH/certs.json)
    CERTIFICATE_ID=$(jq -r ".certificateId" $IOT_RESOURCES_THING_PATH/certs.json)
    
    # create an IoT policy
    POLICY_NAME=${THING_NAME}-policy
    echo "Creating the policy ${POLICY_NAME}..."
    aws iot create-policy --policy-name $POLICY_NAME \
    --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action": "iot:*","Resource":"*"}]}' \
    > $IOT_RESOURCES_THING_PATH/policy.json
    
    # attach the policy to your certificate
    echo "Attaching ${POLICY_NAME} to certificate..."
    aws iot attach-policy --policy-name $POLICY_NAME \
    --target $CERTIFICATE_ARN
    
    # attach the certificate to your thing
    echo "Attaching certificate to ${THING_NAME}..."
    aws iot attach-thing-principal --thing-name $THING_NAME \
    --principal $CERTIFICATE_ARN
    
}


THINGS=($(jq -r '.things[].name' ./config/config.json)) 
for THING in "${THINGS[@]}"
do

    echo "Provisiong: " $THING
    create_thing $THING
    echo "Completed provisioning: " $THING
    
done

# get Amazon root CAs
# Get the CA certificates which could be used to sign
# AWS IoT server certificates
# See also: https://docs.aws.amazon.com/iot/latest/developerguide/managing-device-certs.html 
echo "Getting Amazon root CA certificates..."
ROOT_CA_FILE=$IOT_CERTS_BASE_PATH/root.ca.bundle.pem
cp /dev/null $ROOT_CA_FILE

for ca in \
    https://www.amazontrust.com/repository/AmazonRootCA1.pem \
    https://www.amazontrust.com/repository/AmazonRootCA2.pem \
    https://www.amazontrust.com/repository/AmazonRootCA3.pem \
    https://www.amazontrust.com/repository/AmazonRootCA4.pem; do

    wget --quiet -O - $ca >> $ROOT_CA_FILE

done

echo "Successfully provisioned all AWS IoT resources"