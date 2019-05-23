#!/bin/bash

project_name="rhpam7-install-$(oc whoami)"
oc project ${project_name}

oc replace -n ${project_name} --force -f \
https://raw.githubusercontent.com/sclorg/nodejs-ex/master/openshift/templates/nodejs.json

oc new-app --template="nodejs-example" \
-p NAME="angular-app" \
-p NAMESPACE=${project_name} \
-p NODEJS_VERSION="latest" \
-p SOURCE_REPOSITORY_URL="https://github.com/mechevarria/ocp-pam"
