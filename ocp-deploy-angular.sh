#!/bin/bash

project_name="rhpam7-install-$(oc whoami)"
oc project ${project_name}

oc new-app --strategy="source" \
--name="angular-app" \
--code="https://github.com/mechevarria/ocp-pam"

oc expose svc/angular-app