# NestJS REST API + Apache Kafka Microservices

This project is a monorepo managed by [nx](https://nx.dev) workspace, it contains a REST API with microservices using [Apache Kafka](https://kafka.apache.org/) as message broker and it is built with the [NestJS](https://docs.nestjs.com) framework.  

The project is meant for learning and evaluation purposes only. However, it could also be used to bootstrap live projects.

## Tech Stack
* [NestJS](https://docs.nestjs.com)
* [TypeScript](https://www.typescriptlang.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [KafkaJS](https://kafka.js.org/)
* [Nx](https://nx.dev/)
* [Docker Compose](https://docs.docker.com/compose/)

## Architecture Overview

The project currently has an API gateway listening to external client requests and sits in front of two microservices, it routes requests to appropriate microservices and sends responses to external clients. 

The first microservice (user-microservice) manages user-related requests sent from the API-gateway or other microservices while the other microservice (payment-microservices) manages payment-related requests. Inter-services communication is managed using a message broker and all microservices are designed to have their own databases. 

The application could be easily scaled, and more microservices added as required.

![Architecture Diagram](AD-Kafka.png)

## Credits
* [Vijit Ail](https://www.linkedin.com/in/vijit-ail-376885179)
