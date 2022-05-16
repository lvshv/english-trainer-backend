FROM node:14-alpine as build
WORKDIR /app
ADD *.json .
RUN npm install
ADD . .
RUN npm run build

FROM node:14-alpine
WORKDIR /app
ADD package.json ./
RUN npm install --only=prod
COPY --from=build /app/dist ./dist
CMD ["node", "./dist/main.js"]