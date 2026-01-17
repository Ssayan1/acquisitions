# Acquisitions API

A secure and scalable REST API for managing user acquisitions, built with Node.js, Express, and NeonDB. This project is designed with modern backend practices, including JWT authentication, role-based access control, containerization with Docker, and a full CI/CD pipeline.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Running the Tests](#running-the-tests)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- **JWT Authentication:** Secure user sign-up and sign-in with JSON Web Tokens.
- **Role-Based Access Control (RBAC):** Middleware to restrict access to specific endpoints based on user roles (e.g., `admin`).
- **Advanced Security:** Implements `helmet` for protection against common web vulnerabilities and `Arcjet` for sophisticated rate limiting and bot protection.
- **Containerized Environment:** Fully containerized with Docker and Docker Compose for consistent development and production environments.
- **CI/CD Integration:** Automated workflows using GitHub Actions for linting, formatting, and running tests on every push.
- **Structured Logging:** Centralized logging using `winston` for effective monitoring and debugging.
- **ORM with Drizzle:** Modern TypeScript-first ORM for interacting with the PostgreSQL database.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (managed by [Neon](https://neon.tech/))
- **ORM:** Drizzle ORM
- **Authentication:** JWT (JSON Web Tokens), `bcrypt`
- **Security:** `helmet`, `Arcjet`
- **Containerization:** Docker, Docker Compose
- **Testing:** Jest
- **CI/CD:** GitHub Actions
- **Logging:** `winston`, `morgan`

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd acquisitions
    ```

2.  **Create the environment file:**
    Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```

3.  **Configure your environment variables:**
    Open the `.env` file and fill in the required values. At a minimum, you'll need to set up your Neon database URL and JWT secrets.

    ```dotenv
    # Application Port
    PORT=3000

    # Neon Database Connection String (from your Neon project)
    DATABASE_URL="postgresql://user:password@host:port/dbname"

    # JWT Configuration
    JWT_SECRET="your_super_secret_key"
    JWT_EXPIRES_IN="1h"

    # Arcjet SDK Key (sign up at https://arcjet.com)
    ARCJET_KEY="your_arcjet_sdk_key"
    ```

4.  **Start the application:**
    Use the development Docker Compose file to build and start the application and the local Neon database proxy.

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

The API should now be running and accessible at `http://localhost:3000`.

---

## Running the Tests

This project uses Jest for unit and integration testing.

To run the test suite, execute the following command:

```bash
npm test
```

This will run all tests located in the `tests/` directory.

---

## API Endpoints

Here is a summary of the available API routes.

### Authentication (`/api/auth`)

| Method | Endpoint         | Auth Required | Description                                     |
|--------|------------------|---------------|-------------------------------------------------|
| `POST` | `/sign-up`       | No            | Creates a new user account.                     |
| `POST` | `/sign-in`       | No            | Authenticates a user and returns a JWT.         |
| `POST` | `/sign-out`      | Yes           | Clears the authentication cookie.               |
| `GET`  | `/me`            | Yes           | Retrieves the profile of the currently logged-in user. |

### Users (`/api/users`)

| Method | Endpoint         | Auth Required | Description                                     |
|--------|------------------|---------------|-------------------------------------------------|
| `GET`  | `/`              | Yes (`admin`) | Retrieves a list of all users.                  |
| `GET`  | `/:id`           | Yes (`admin`) | Retrieves a single user by their ID.            |

---

## CI/CD Pipeline

This project uses **GitHub Actions** for its Continuous Integration and Continuous Delivery pipeline. The workflows are defined in the `.github/workflows/` directory.

- **`lint-and-format.yml`:** Automatically checks for code formatting and linting errors on every push to ensure code quality and consistency.
- **`tests.yml`:** Runs the full Jest test suite on every push to ensure that new changes do not break existing functionality.
- **`docker-build-and-push.yml`:** Provides a workflow to build the production Docker image and push it to a container registry (this is a manual/template workflow to be configured).

---

## Project Structure

```
.
├── docker-compose.dev.yml
├── Dockerfile
├── drizzle.config.js
├── .env.example
├── package.json
├── .github/                # GitHub Actions Workflows
│   └── workflows/
├── drizzle/                # Drizzle ORM migration files
├── src/                    # Source code
│   ├── app.js              # Main Express app configuration
│   ├── index.js            # Application entry point
│   ├── server.js           # Server setup
│   ├── config/             # Application configuration
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models/schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Services layer (business logic separated from controllers)
│   ├── utils/              # Utility functions
│   └── validations/        # Request validation schemas
└── tests/                  # Automated tests
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
