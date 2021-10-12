# Denis Law Legacy Trust Booking Application

The DLLT Street Sports event booking application provides events registration
functionality for two primary users. Event attendees will be able to register
their attendance at events. Event administrators will be able to view the
details of attendees for an event.

## Usage

### Running Locally

1. Create a file named .env in the project root
2. Add variables in the "Environment Configuration" Section below into .env file
3. run `npm install` in terminal
4. run `npm start` in terminal

#### Requirements for running locally

- NodeJs
- npm

### Running with Docker

1. Create a file named docker.env in the project root
2. Add variables in the Configuration Section below into docker.env file
3. run `docker-compose --env-file docker.env up` in terminal

#### Requirements for Docker

- Docker
- docker-compose

### Environment Configuration

Environment variables requried to run the application with associated explanations.

- HTTPPORT (Port at which the api will be available)
