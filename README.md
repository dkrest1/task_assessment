# Task Management API - NIYO Group Assessment

## Description

The Task Management API allows users to create, read, update, and delete tasks efficiently. 
Authentication is handled using Passport, and authorization is managed with Passport JWT. 
This ensures secure access, enabling users to manage their tasks effectively 
while maintaining data privacy and integrity.

## Key Features

- **User Authentication and Authorization:** Secure user authentication using Passport and JWT for authorization.
- **Task Management:** Comprehensive CRUD operations for managing tasks.
- **User-Specific Task Handling:** Each user can only access and manage their own tasks.
- **Real-Time Updates:** WebSocket integration for live data streaming, providing real-time updates to users.

## Prerequisites

- Node.js (20.x)
- PostgreSQL
- NestJS CLI (optional)
- NestJS Framework
- TypeORM with PostgreSQL
- JWT for Authentication and Authorization

## Getting Started

1. Clone the repository:

```bash
$ git clone repo url
$ cd niyo_group_assessment
```

2. Create a `.env`file and put in the right credentials:

```bash
$ cp .env.example .env
$ source .env
```
**PS:** ensure you fill your .env file before starting the server

3. Start the Server
  
```bash
$ npm install
$ npm run start:dev
```

## API documentation

The API documentation is available via Swagger. To view all the available endpoints and their details, visit:

[API Documentation](http://localhost:3000/api/docs) 

**PS:** The above URL is for your local development server

### Example Endpoints

#### Create Task

**Endpoint:** `/api/tasks`

**Method:** `POST`

**Description:** This endpoint allows you to create a new task.

**Request Body:**

| Field         | Type   | Description                                            |
|---------------|--------|--------------------------------------------------------|
| `title`       | string | The title of the task                                  |
| `description` | string | A description of the task                              |
| `status`      | string | The status of the task (pending, inProgress, completed)|

**Response:**

**Success (201 Created):**

```json
{
  "id": 1,
  "title": "Sample task",
  "description": "Sample description",
  "status": "pending",
  "createdAt": "2024-05-18T12:34:56.000Z",
  "updatedAt": "2024-05-18T12:34:56.000Z"
}
```

##### Example Usage
```bash
$ curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{
           "title": Sample task,
           "description": "Sample description",
           "status: "pending"
        }'
```

#### Get All Tasks for a User

**Endpoint:** `/api/tasks/{userId}`

**Method:** `GET`

**Description:** This endpoint retrieves all tasks for the authenticated user..

**Request Body:**


**Response:**

**Success (200 Success):**

```json
{
  "statusCode": 200,
  "message": "Success.",
  "payload": [
    {
      "id": "123abc",
      "title": "Example Task",
      "description": "Task One",
      "status": "completed",
      "created_at": "2024-05-20T01:18:30.847Z",
      "updated_at": "2024-05-20T01:18:30.847Z",
      "userId": {
        "id": "123abc",
        "email": "example@example.com",
        "username": "example",
        "fullname": "example",
        "created_at": "2024-05-20T00:20:16.897Z",
        "updated_at": "2024-05-20T00:20:16.897Z"
      }
    },
  ]
}
```

##### Example Usage
```bash
$ curl -X GET http://localhost:3000/api/tasks/user123
```

#### Real-Time Updates

To receive real-time updates on task changes, connect to the WebSocket endpoint provided by the server. 
This feature allows users to get immediate updates on their tasks without needing to refresh or poll the server.

###### Author

Oluwatosin Akande

[GitHub Profile](https://github.com/dkrest1) | [LinkedIn Profile](https://www.linkedin.com/in/oluwatosin-akande1)