# Database Proxy API

This project aims to create a generic database proxy that provides a REST API for CRUD operations on a SQL database. The API will handle Create, Read, Update, and Delete operations, with the SQL statements dynamically generated based on the schema provided during server startup.

## Technical Stack

- **Language:** `JavaScript`
- **Runtime:** `Node.js`
- **Framework:** `Express` (used for handling HTTP requests)
- **Database:** `PostgreSQL`
- **Schema Format:** `JSON`
- **Architecture:** `MVC - Model, View, Controller`

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- `PostgreSQL` installed on your machine.
- A database to begin with. Create it with `pgAdmin` and set the environment variables in a `.env` file.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/database-proxy.git
    ```

2. Navigate the project directory

    ```sh
    cd database-proxy
    ```

3. Install dependencies:

    ```sh
    npm install
    ```
4. Run the application:

    ```sh
    npm run dev
    ```
This will start the server on `http://localhost:3000.`

## Project Structure

<pre>
root/
├── README.md
├── package.json
├── package-lock.json
├── server.js
├── config/
│   └── index.js
├── controllers/
│   └── dbController.js
├── models/
│   ├── schema.json
│   └── dbModel.js
└── routes/
    └── dbRoutes.js

</pre>

## API Endpoints

### Create Record:
  - **Endpoint**: `POST /:collection`
  - **Example**: `POST /users`
  - **Request Body**: JSON data representing the new record.

### Read Record:
  - **Endpoint**: `GET /:collection/:id`
  - **Example**: `GET /users/123`
  - **Response**: JSON data of the specified record.

### Update Record:
  - **Endpoint**: `POST /:collection/:id`
  - **Example**: `POST /users/123`
  - **Request Body**: JSON data with the updated values.

### Delete Record:
  - **Endpoint**: `DELETE /:collection/:id`
  - **Example**: `DELETE /users/123`

## Existence of Tables

This DB Proxy checks for the existence of the tables specified by the `schema.json` file and creates/adds columns if not detected using the `ALTER TABLE` command.

## Concurrency

In a concurrent environment, this application excels in maintaining data consistency and performance through:

### 1. Connection Pooling

```js
// config/db.js
const { Pool } = require('pg');
const pool = new Pool({ /* ... */ });
module.exports = pool;
```

Efficiently manages multiple database connections, essential for handling concurrent requests.

### 2. Transactions:

```js
// controllers/DBController.js
// Example in createRecord, updateRecord, deleteRecord, and getRecord functions
const client = await pool.connect();
await client.query('BEGIN');
// ... (queries)
await client.query('COMMIT');
```
Uses transactions to ensure atomicity of operations, critical for consistent database changes in concurrent scenarios.

### 3. Asynchronous Code Handling:

```js
// controllers/DBController.js
// Example in createRecord, updateRecord, deleteRecord, and getRecord functions
const result = await pool.query(/* SQL Query */);
```
Employs asynchronous code handling to prevent blocking and efficiently manage concurrent requests.

### 4. Error Handling and Rollback:

```js
// controllers/DBController.js
// Example in createRecord, updateRecord, deleteRecord, and getRecord functions
await client.query('ROLLBACK');
throw error;
```
Implements robust error handling and rollback mechanisms within transactions for consistent error recovery.


## Scope for Improvement
- **Dynamic Column Defintions**: Allowing configuration of column types based on the schema definition. For example, if the schema specifies a column as a number, use an appropriate numeric type in the database (e.g., `INTEGER`, `NUMERIC`, etc.).

- **Input Validation**: This can be improved in controllers to ensure that the received data is valid and secure, preventing potential security vulnerabilities.

- **Logging**: This can be enhanced to provide more detailed information about errors, transactions, and critical events. This can aid in debugging and monitoring.

- **Middleware**: We can consider using middleware functions to handle common functionalities like request logging, authentication, and validation. This can improve code modularity.

- **Unit Testing**: Unit test coverage can be improvised, particularly for edge cases and error scenarios. Ensure that all critical functions are tested thoroughly.

- **Database Schema Evolution**: Schema evolution mechanism can be implemented to handle changes gracefully without losing data, especially in a production environment.

- **Concurrency Stress Testing**: Performing concurrency stress testing can be done to ensure the application can handle a high volume of concurrent requests gracefully.