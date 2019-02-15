FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Set variables and locales
ENV \
    LOG_LEVEL="info" \
    MQTTHOST="" \
    MQTTPORT="1883" \
    TELNETHOST="" \
    TELNETPORT="8234" 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm install --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]