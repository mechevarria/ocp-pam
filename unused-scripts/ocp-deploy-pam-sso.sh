#!/usr/bin/env bash

# pulled commands from
# https://github.com/jbossdemocentral/rhpam7-install-demo/blob/master/support/openshift/provision.sh

oc login -u developer
proj_name="rhpam7-install-developer"

oc project ${proj_name}

# variables
KIE_ADMIN_USER=pamadmin
KIE_ADMIN_PWD=redhatpam1!
KIE_SERVER_CONTROLLER_USER=kieserver
KIE_SERVER_CONTROLLER_PWD=kieserver1!
KIE_SERVER_USER=kieserver
KIE_SERVER_PWD=kieserver1!
OPENSHIFT_PAM7_TEMPLATES_TAG=7.3.0.GA
IMAGE_STREAM_TAG=1.0

echo ""
echo "########################################## Login Required ##########################################"
echo "# The new Red Hat Image Registry requires users to login with their Red Hat Network (RHN) account. #"
echo "# If you do not have an RHN account yet, you can create one at https://developers.redhat.com       #"
echo "####################################################################################################"
echo ""

echo "Enter RHN username:"
read RHN_USERNAME

echo "Enter RHN password:"
read -s RHN_PASSWORD

echo "Enter e-mail address:"
read RHN_EMAIL

oc create secret docker-registry red-hat-container-registry \
--docker-server=registry.redhat.io \
--docker-username="$RHN_USERNAME" \
--docker-password="$RHN_PASSWORD" \
--docker-email="$RHN_EMAIL"

oc secrets link builder red-hat-container-registry --for=pull

echo_header "Importing Image Streams"
oc create -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/rhpam73-image-streams.yaml

oc import-image rhpam73-businesscentral-openshift:$IMAGE_STREAM_TAG —confirm -n ${proj_name}
oc import-image rhpam73-kieserver-openshift:$IMAGE_STREAM_TAG —confirm -n ${proj_name}

echo_header "Importing Templates"
oc create -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/templates/rhpam73-authoring.yaml

echo_header "Importing secrets and service account."
oc process -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/example-app-secret-template.yaml | oc create -f -
oc process -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/example-app-secret-template.yaml -p SECRET_NAME=kieserver-app-secret | oc create -f -

oc create serviceaccount businesscentral-service-account
oc create serviceaccount kieserver-service-account
oc secrets link --for=mount businesscentral-service-account businesscentral-app-secret
oc secrets link --for=mount kieserver-service-account kieserver-app-secret

oc new-app --template=rhpam73-authoring \
-p APPLICATION_NAME="rhpam7-install" \
-p IMAGE_STREAM_NAMESPACE="$proj_name" \
-p KIE_ADMIN_USER="$KIE_ADMIN_USER" \
-p KIE_ADMIN_PWD="$KIE_ADMIN_PWD" \
-p KIE_SERVER_CONTROLLER_USER="$KIE_SERVER_CONTROLLER_USER" \
-p KIE_SERVER_CONTROLLER_PWD="$KIE_SERVER_CONTROLLER_PWD" \
-p KIE_SERVER_USER="$KIE_SERVER_USER" \
-p KIE_SERVER_PWD="$KIE_SERVER_PWD" \
-p BUSINESS_CENTRAL_HTTPS_SECRET="businesscentral-app-secret" \
-p KIE_SERVER_HTTPS_SECRET="kieserver-app-secret" \
-p BUSINESS_CENTRAL_MEMORY_LIMIT="2Gi" \
-p SSO_URL="https://sso-rhpam7-app.192.168.42.213.nip.io/auth" \
-p SSO_REALM="pam-realm" \
-p KIE_SERVER_SSO_CLIENT="kie-server" \
-p KIE_SERVER_SSO_SECRET="e014cf25-1990-4eda-948f-bdc456e1e091" \
-p BUSINESS_CENTRAL_SSO_CLIENT="business-central" \
-p BUSINESS_CENTRAL_SSO_SECRET="8375e93d-d34c-4a0f-ae48-c338a174b8eb" \
-p SSO_DISABLE_SSL_CERTIFICATE_VALIDATION="true"