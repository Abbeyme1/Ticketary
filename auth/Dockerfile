FROM node:alpine

WORKDIR /app

COPY package.json .

# RUN npm install --only=prod
RUN npm install --production

COPY . .

CMD [ "npm","start" ]
