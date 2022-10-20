FROM node:18-alpine3.15
WORKDIR /app 

COPY package*.json ./
RUN npm install

RUN cd /app && ls -a

CMD ["npm", "run", "test:watch"]
