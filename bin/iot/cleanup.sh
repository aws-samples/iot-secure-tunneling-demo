#!/bin/bash
mydir="${0%/*}"
CONFIG_PATH=$mydir/../../config
IOT_RESOURCES_PATH=$CONFIG_PATH/iot/resources
IOT_CERTS_PATH=$CONFIG_PATH/iot/certs
EC2_RESOURCES_PATH=$CONFIG_PATH/ec2

THING_NAME=$(jq -r ".thingName" $IOT_RESOURCES_PATH/thing.json)
POLICY_NAME=${THING_NAME}-policy
CERTIFICATE_ARN=$(jq -r ".certificateArn" $IOT_RESOURCES_PATH/certs.json)
CERTIFICATE_ID=$(jq -r ".certificateId" $IOT_RESOURCES_PATH/certs.json)

# detach the policy to your certificate
echo "[1/5] Detaching ${POLICY_NAME} from certificate..."
aws iot detach-policy --policy-name $POLICY_NAME \
--target $CERTIFICATE_ARN

# detach the certificate to your thing
echo "[2/5] Detaching certificate from ${THING_NAME}..."
aws iot detach-thing-principal --thing-name $THING_NAME \
--principal $CERTIFICATE_ARN

# delete the policy
echo "[3/5] Deleting the policy ${POLICY_NAME}..."
aws iot delete-policy --policy-name $POLICY_NAME

# delete the certificate
echo "[4/5] Deleting the certificate..."
aws iot update-certificate --certificate-id ${CERTIFICATE_ID} --new-status INACTIVE
aws iot delete-certificate --certificate-id ${CERTIFICATE_ID}

# delete the thing
echo "[5/5] Deleting the thing ${THING_NAME}..."
aws iot delete-thing --thing-name $THING_NAME

echo "Successfully deleted all AWS IoT resources"