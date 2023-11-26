# Database Proxy API

This project aims to create a generic database proxy that provides a REST API for CRUD operations on a SQL database. The API will handle Create, Read, Update, and Delete operations, with the SQL statements dynamically generated based on the schema provided during server startup.

### Technical Stack

- **Language:** JavaScript
- **Runtime:** Node.js
- **Framework:** Express (used for handling HTTP requests)
- **Database:** PostgreSQL
- **Schema Format:** JSON

### Prerequisites

Before you begin, make sure you have the following prerequisites:

- `PostgreSQL` installed on your machine.
- A database to begin with. Create it with `pgAdmin` and set the environment variables in a `.env` file.

### Installation

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

### API Endpoints

#### Create Record:
  - Endpoint: `POST /:collection`
  - Example: `POST /users`
  - Request Body: JSON data representing the new record.

#### Read Record:
  - Endpoint: `GET /:collection/:id`
  - Example: `GET /users/123`
  - Response: JSON data of the specified record.

### Update Record:
  - Endpoint: `POST /:collection/:id`
  - Example: `POST /users/123`
  - Request Body: JSON data with the updated values.

#### Delete Record:
  - Endpoint: `DELETE /:collection/:id`
  - Example: `DELETE /users/123`
