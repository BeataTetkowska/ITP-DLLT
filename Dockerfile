# Tells docker to create the container using a node 
# container as the base image. 
FROM node:12-slim

# Creates an environment variable in the container 
# When the environment variable "NODE_ENV" is set to
# production, npm will not waste time or space installing
# dev dependancies. 
ENV NODE_ENV=production

# Sets the working directory inside the container to /app
WORKDIR /app

# Copies the package.json and package-lock.json files
# from the local directory into the container's working directory
COPY ["package.json", "package-lock.json*", "./"]

# Copies the docker.env file from the local directory into 
# the working directory in the container. 
# docker.env will need to be created by each user of the repository and 
# will contain environment variable config to be used inside the container
COPY ["./docker.env", "./.env"]

# Runs a command inside the container
# npm ci --production will install the dependancies required for the 
# application without changing the package-lock.json file
RUN npm ci --production

# Copies all of the remaining files from the local directory to
# the containers working directory. This command is why the dockerignore
# file is required. 
COPY . .

# Specifies the command which will be run when the container is launched. 
CMD [ "npm", "start"]
