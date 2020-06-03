#!/bin/bash
mydir="${0%/*}"

cd $mydir/../../cdk
npx npm-check-updates -u
npm install
cdk bootstrap
npm run build
cdk deploy --require-approval never