#!/usr/bin/env bash

# pulled commands from
# https://github.com/jbossdemocentral/rhpam7-install-demo/blob/master/support/openshift/provision.sh

oc login -u developer

# variables
PROJ_NAME="rhpam7-install-sso"
KIE_ADMIN_USER=pamadmin
KIE_ADMIN_PWD=redhatpam1!
KIE_SERVER_CONTROLLER_USER=kieserver
KIE_SERVER_CONTROLLER_PWD=kieserver1!
KIE_SERVER_USER=kieserver
KIE_SERVER_PWD=kieserver1!
OPENSHIFT_PAM7_TEMPLATES_TAG=7.3.1.GA
BUSINESS_CENTRAL_MAVEN_USERNAME=mavenuser
BUSINESS_CENTRAL_MAVEN_PASSWORD=mavenuser1!
IMAGE_STREAM_TAG=1.1
SSO_REALM="pam-realm"
SSO_URL="https://sso-rhpam7-install-sso.192.168.42.213.nip.io/auth"
KIE_SERVER_SSO_CLIENT="kie-server"
KIE_SERVER_SSO_SECRET="a655d5c5-fbfe-41bb-9a81-68b993579155"
BUSINESS_CENTRAL_SSO_CLIENT="business-central"
BUSINESS_CENTRAL_SSO_SECRET="b3000d7d-2631-488b-b5ed-6b117e999f0a"

oc project ${PROJ_NAME}

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

echo "Importing Image Streams"
oc create -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/rhpam73-image-streams.yaml

sleep 10

oc import-image rhpam73-businesscentral-openshift:$IMAGE_STREAM_TAG —confirm -n ${PROJ_NAME}
oc import-image rhpam73-kieserver-openshift:$IMAGE_STREAM_TAG —confirm -n ${PROJ_NAME}

echo "Importing Templates"
oc create -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/templates/rhpam73-authoring.yaml

echo "Importing secrets and service account."
oc process -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/example-app-secret-template.yaml | oc create -f -
oc process -f https://raw.githubusercontent.com/jboss-container-images/rhpam-7-openshift-image/$OPENSHIFT_PAM7_TEMPLATES_TAG/example-app-secret-template.yaml -p SECRET_NAME=kieserver-app-secret | oc create -f -

oc create serviceaccount businesscentral-service-account
oc create serviceaccount kieserver-service-account
oc secrets link --for=mount businesscentral-service-account businesscentral-app-secret
oc secrets link --for=mount kieserver-service-account kieserver-app-secret

oc new-app --template=rhpam73-authoring \
-p APPLICATION_NAME="rhpam7-install" \
-p IMAGE_STREAM_NAMESPACE="$PROJ_NAME" \
-p KIE_ADMIN_USER="$KIE_ADMIN_USER" \
-p KIE_ADMIN_PWD="$KIE_ADMIN_PWD" \
-p KIE_SERVER_CONTROLLER_USER="$KIE_SERVER_CONTROLLER_USER" \
-p KIE_SERVER_CONTROLLER_PWD="$KIE_SERVER_CONTROLLER_PWD" \
-p KIE_SERVER_USER="$KIE_SERVER_USER" \
-p KIE_SERVER_PWD="$KIE_SERVER_PWD" \
-p BUSINESS_CENTRAL_HTTPS_SECRET="businesscentral-app-secret" \
-p KIE_SERVER_HTTPS_SECRET="kieserver-app-secret" \
-p BUSINESS_CENTRAL_MEMORY_LIMIT="2Gi" \
-p SSO_URL=$SSO_URL \
-p SSO_REALM=$SSO_REALM \
-p KIE_SERVER_SSO_CLIENT=$KIE_SERVER_SSO_CLIENT \
-p KIE_SERVER_SSO_SECRET=$KIE_SERVER_SSO_SECRET \
-p BUSINESS_CENTRAL_SSO_CLIENT=$BUSINESS_CENTRAL_SSO_CLIENT \
-p BUSINESS_CENTRAL_SSO_SECRET=$BUSINESS_CENTRAL_SSO_SECRET \
-p SSO_DISABLE_SSL_CERTIFICATE_VALIDATION="true" \
-p BUSINESS_CENTRAL_MAVEN_USERNAME=$BUSINESS_CENTRAL_MAVEN_USERNAME \
-p BUSINESS_CENTRAL_MAVEN_PASSWORD=$BUSINESS_CENTRAL_MAVEN_PASSWORD
