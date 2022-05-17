# FROM node:14-alpine as build
# WORKDIR /app
# ADD *.json .
# RUN npm install
# ADD . .
# RUN npm run build

# FROM node:14-alpine
# WORKDIR /app
# ADD package.json ./
# RUN npm install
# COPY --from=build /app/dist ./dist
# CMD ["node", "./dist/main.js"]

FROM node:14-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]