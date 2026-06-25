#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsIotSecTunnelStack } from '../lib/aws-iot-sec-tunnel-stack';

const app = new cdk.App();
new AwsIotSecTunnelStack(app, 'AwsIotSecTunnelStack');
