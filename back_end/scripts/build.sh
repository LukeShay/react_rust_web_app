#!/bin/bash
rm -rf build
rm -rf rest-api.jar
rm -rf restapi.log

./gradlew clean build \
    -x jacocoTestReport \
    -x test \
    -x verifyGoogleJavaFormat \
    -x compileTestKotlin \
    -x compileTestJava \
    -x processTestResources \
    -x testClasses \
    -x bootDistTar \
    -x bootDistZip \
    -x distTar \
    -x distZip \
    -x startScripts \
    -x check \
    || exit 1

mv build/libs/*.jar rest-api.jar || exit 1
java -Dspring.data.mongodb.uri=mongodb://rest-api-mongo:27017/rest-api-mongo -Djava.security.egd=file:/dev/./urandom -DJWT_SECRET=$JWT_SECRET -DREFRESH_SECRET=$REFRESH_SECRET -DACCESS_KEY=$ACCESS_KEY -DSECRET_KEY=$SECRET_KEY -jar rest-api.jar || exit 1
