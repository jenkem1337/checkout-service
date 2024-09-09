FROM node:20.17.0-alpine
    WORKDIR /home/node/app
    COPY package*.json ./
    RUN npm install --force
    COPY . .
    RUN rm -f /home/node/app/.env && \
        mv /home/node/app/.env.docker /home/node/app/.env
    CMD ["npm","start"]