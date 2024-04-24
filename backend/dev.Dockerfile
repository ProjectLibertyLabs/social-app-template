FROM node:20

WORKDIR /app

EXPOSE 3000

VOLUME [ "/app" ]

ENTRYPOINT [ "npm", "run", "container-run:dev" ]
