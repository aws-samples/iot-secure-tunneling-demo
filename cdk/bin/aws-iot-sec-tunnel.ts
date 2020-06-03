#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { AwsIotSecTunnelStack } from '../lib/aws-iot-sec-tunnel-stack';

const app = new cdk.App();
new AwsIotSecTunnelStack(app, 'AwsIotSecTunnelStack');