#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MiuLoggV3IacStack } from '../lib/miu-logg-v3-iac-stack';

const app = new cdk.App();
new MiuLoggV3IacStack(app, 'MiuLoggV3IacStack');
