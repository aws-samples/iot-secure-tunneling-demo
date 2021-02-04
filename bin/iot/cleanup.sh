#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config

cleanup_thing() {
    THING_NAME=$1
    
    IOT_RESOURCES_THING_PATH=$CONFIG_PATH/iot/resources/$THING_NAME
    
    POLICY_NAME=${THING_NAME}-policy
    CERTIFICATE_ARN=$(jq -r ".certificateArn" $IOT_RESOURCES_THING_PATH/certs.json)
    CERTIFICATE_ID=$(jq -r ".certificateId" $IOT_RESOURCES_THING_PATH/certs.json)

    # detach the policy to your certificate
    echo "Detaching ${POLICY_NAME} from certificate..."
    aws iot detach-policy --policy-name $POLICY_NAME \
    --target $CERTIFICATE_ARN
    
    # detach the certificate to your thing
    echo "Detaching certificate from ${THING_NAME}..."
    aws iot detach-thing-principal --thing-name $THING_NAME \
    --principal $CERTIFICATE_ARN
    
    # delete the policy
    echo "Deleting the policy ${POLICY_NAME}..."
    aws iot delete-policy --policy-name $POLICY_NAME
    
    # delete the certificate
    echo "Deleting the certificate..."
    aws iot update-certificate --certificate-id ${CERTIFICATE_ID} --new-status INACTIVE
    aws iot delete-certificate --certificate-id ${CERTIFICATE_ID}
    
    # delete the thing
    echo "Deleting the thing ${THING_NAME}..."
    aws iot delete-thing --thing-name $THING_NAME
}

THINGS=($(jq -r '.things[].name' ./config/config.json)) 
for THING in "${THINGS[@]}"
do

    echo "Deprovisioning: " $THING
    cleanup_thing $THING
    echo "Completed deprovisioning: " $THING
    
done


echo "Successfully deleted all AWS IoT resources"