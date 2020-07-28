FROM node:10-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

# Bundle app source
COPY . /usr/app/

# Install app dependencies
RUN yarn

#EXPOSE 3000
CMD [ "yarn", "dev" ]
