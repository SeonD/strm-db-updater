FROM node:14

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY dist ./

RUN ls

CMD [ "node", "index.js"]
