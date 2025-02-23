FROM node:18

WORKDIR /application

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
