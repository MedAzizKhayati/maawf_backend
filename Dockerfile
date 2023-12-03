FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 

RUN yarn build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn --only=prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "prod"]
