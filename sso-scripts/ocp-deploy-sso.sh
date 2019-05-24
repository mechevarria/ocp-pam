#!/usr/bin/env bash

oc login -u developer

proj_name="rhpam7-install-sso"
proj_exists="$(oc projects | grep ${proj_name})"

# if project doesn't exist, make a new one.  Otherwise switch to that project
if [[ -z ${proj_exists} ]]; then
  oc new-project ${proj_name} --display-name="RHPAM7 SSO" --description="SSO with Red Hat Process Automation Manager 7"
else
  oc project ${proj_name}
fi

oc policy add-role-to-user view system:serviceaccount:$(oc project -q):default

# using custom template to reference theme image stream and force using openshift namespace for postgresql
oc new-app --template=sso73-x509-postgresql-persistent \
 -p SSO_ADMIN_USERNAME="admin" \
 -p SSO_ADMIN_PASSWORD="redhatsso1!" \
 -p SSO_REALM="pam-realm"
