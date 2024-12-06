FROM node:lts-alpine
WORKDIR /bot
# COPY --exclude=config.json --exclude=node_modules --exclude=scores.db * /.
COPY ./ .
RUN yarn install
CMD ["yarn", "start"]