#!/bin/bash
mydir="${0%/*}"

GITHUB_REPO_URL=$1

cd $mydir/../../cdk
npx npm-check-updates -u
npm install
cdk bootstrap
npm run build

if [ -z $GITHUB_REPO_URL ] 
then
    cdk deploy --require-approval never
else
    cdk deploy --require-approval never --parameters githubRepoUrl=$GITHUB_REPO_URL
fi
