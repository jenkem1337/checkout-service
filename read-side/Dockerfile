FROM node:20.17.0-alpine
    WORKDIR /home/node/app
    COPY package*.json ./
    RUN npm install --force
    COPY . .
    CMD ["npm","start"]