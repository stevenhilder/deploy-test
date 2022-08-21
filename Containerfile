FROM docker.io/library/ubuntu:22.04

COPY [ ".", "/var/www/" ]
COPY [ "curl", "node", "/usr/bin/" ]

ENTRYPOINT [ "/usr/bin/node", "/var/www/dist/entrypoint.js" ]
