#FROM 474723000929.dkr.ecr.eu-south-1.amazonaws.com/dummy-webserver-project/build-container:3.0.1 AS build-container

FROM docker.io/library/ubuntu:22.04
COPY [ ".", "/var/www/" ]
COPY [ "../curl", "../node", "/usr/bin/" ]
#COPY --from=build-container [ "/tmp/build-container/curl", "/tmp/build-container/node", "/usr/bin/" ]

ENTRYPOINT [ "/usr/bin/node", "/var/www/dist/entrypoint.js" ]
