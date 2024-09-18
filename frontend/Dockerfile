FROM node:16
# Install git
RUN apk add --no-cache git
#RUN apt-get update && apt-get install -y git
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Build the application
RUN npm run build
# Set the command to start the server
CMD ["npm", "start"]
