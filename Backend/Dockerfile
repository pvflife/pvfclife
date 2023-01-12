FROM node:14.18.3

WORKDIR /

COPY package*.json ./

RUN npm ci

COPY . ./

CMD [ "npm", "run", "start" ]