  <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./fastfeet-logo.svg" width="200" alt="Nest Logo" /></a>
</p>
  <p align="center">A API developed for Rocketseat's Ignite bootcamp.</p>
    <p align="center">

## Description

This API was developed with the aim of putting into practice the knowledge acquired during the Ignite bootcamp whose specialization was in Node.js

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Features

- [x] The application must have two types of users, delivery person and/or admin;
- [x] It must be possible to log in with CPF and Password;
- [x] It must be possible to perform CRUD of deliveryman;
- [x] It must be possible to perform CRUD of deliveries;
- [x] It must be possible to perform CRUD on recipients;
- [x] It must be possible to mark an delivery as waiting (Available for pickup);
- [x] It must be possible to pick up an delivery;
- [x] It must be possible to mark an delivery as delivered;
- [x] It must be possible to mark an delivery as returned;
- [x] It must be possible to list deliveries with delivery addresses close to the delivery person's location;
- [x] It must be possible to change a user's password;
- [x] It must be possible to list a user's deliveries;
- [x] It must be possible to notify the recipient of each change in the delivery status.

#### Conditions

- Only admin type users can perform CRUD operations on deliveries;
- Only an admin user can perform CRUD operations for deliveryman;
- Only admin type users can perform CRUD operations on recipients;
- To mark an delivery as delivered, you must send a photo;
- Only the delivery person who picked up the delivery can mark it as delivered;
- Only the admin can change a user's password;
- It should not be possible for a delivery person to list the orders of another delivery person.