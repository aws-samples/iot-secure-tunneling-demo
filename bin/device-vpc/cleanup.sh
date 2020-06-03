#!/bin/bash
mydir="${0%/*}"

cd $mydir/../../cdk
cdk destroy --force