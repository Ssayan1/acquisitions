# Acquisitions API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Linted-green?style=for-the-badge)](https://eslint.org/)
[![Testing](https://img.shields.io/badge/Testing-Jest-red?style=for-the-badge&logo=jest)](https://jestjs.io/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-black?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)

</div>

---

## 📋 Overview

A secure and scalable REST API for managing user acquisitions, built with **Node.js**, **Express**, and **NeonDB**. This project is designed with modern backend practices, including JWT authentication, role-based access control, containerization with Docker, and a full CI/CD pipeline.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [🧪 Running the Tests](#-running-the-tests)
- [📡 API Endpoints](#-api-endpoints)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [📁 Project Structure](#-project-structure)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- **🔐 JWT Authentication:** Secure user sign-up and sign-in with JSON Web Tokens.
- **🛡️ Role-Based Access Control (RBAC):** Middleware to restrict access to specific endpoints based on user roles (e.g., `admin`).
- **🔒 Advanced Security:** Implements `helmet` for protection against common web vulnerabilities and `Arcjet` for sophisticated rate limiting and bot protection.
- **🐳 Containerized Environment:** Fully containerized with Docker and Docker Compose for consistent development and production environments.
- **⚙️ CI/CD Integration:** Automated workflows using GitHub Actions for linting, formatting, and running tests on every push.
- **📊 Structured Logging:** Centralized logging using `winston` for effective monitoring and debugging.
- **🗄️ ORM with Drizzle:** Modern TypeScript-first ORM for interacting with the PostgreSQL database.
- **✅ Comprehensive Testing:** Full Jest test coverage for robust code quality.
- **⚡ High Performance:** Optimized queries and efficient middleware configuration.
- **📦 Production Ready:** Follows industry best practices and standards.

---

## 🛠️ Technology Stack

### Backend & Framework
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript

### Database
- **PostgreSQL** - Primary database
- **NeonDB** - Managed PostgreSQL hosting
- **Drizzle ORM** - Modern TypeScript-first ORM

### Authentication & Security
- **JWT** (JSON Web Tokens) - Token-based authentication
- **bcrypt** - Password hashing
- **Helmet** - HTTP security headers
- **Arcjet** - Rate limiting & bot protection

### Testing & Quality
- **Jest** - Unit and integration testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD automation

### Monitoring & Logging
- **Winston** - Structured logging
- **Morgan** - HTTP request logging

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/) for version control

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd acquisitions
   ```

2. **Create the environment file:**
   
   Copy the example environment file to create your local configuration.

   ```bash
   cp .env.example .env
   ```

3. **Configure your environment variables:**
   
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
   
   # Environment
   NODE_ENV="development"
   ```

4. **Start the application:**
   
   Use the development Docker Compose file to build and start the application and the local Neon database proxy.

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   The API should now be running and accessible at `http://localhost:3000`.

5. **Verify the setup:**
   
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## 🧪 Running the Tests

This project uses **Jest** for unit and integration testing.

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

All tests are located in the `tests/` directory and follow the pattern `*.test.ts` or `*.spec.ts`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Auth Required | Description                                            |
|--------|-------------|---------------|--------------------------------------------------------|
| `POST` | `/sign-up`  | ❌ No         | Creates a new user account.                            |
| `POST` | `/sign-in`  | ❌ No         | Authenticates a user and returns a JWT.                |
| `POST` | `/sign-out` | ✅ Yes        | Clears the authentication cookie.                      |
| `GET`  | `/me`       | ✅ Yes        | Retrieves the profile of the currently logged-in user. |

### Users (`/api/users`)

| Method | Endpoint | Auth Required | Role Required | Description                          |
|--------|----------|---------------|---------------|--------------------------------------|
| `GET`  | `/`      | ✅ Yes        | 🔐 Admin      | Retrieves a list of all users.       |
| `GET`  | `/:id`   | ✅ Yes        | 🔐 Admin      | Retrieves a single user by their ID. |

### Health Check (`/api/health`)

| Method | Endpoint | Auth Required | Description            |
|--------|----------|---------------|------------------------|
| `GET`  | `/`      | ❌ No         | Server health status.  |

---

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for its Continuous Integration and Continuous Delivery pipeline. The workflows are defined in the `.github/workflows/` directory.

### Workflows

- **`lint-and-format.yml`** ✅ Automatically checks for code formatting and linting errors on every push to ensure code quality and consistency.
- **`tests.yml`** ✅ Runs the full Jest test suite on every push to ensure that new changes do not break existing functionality.
- **`docker-build-and-push.yml`** 🐳 Provides a workflow to build the production Docker image and push it to a container registry (manual/template workflow).

### Running Workflows Locally

You can test GitHub Actions workflows locally using [act](https://github.com/nektos/act):

```bash
# List available workflows
act --list

# Run a specific workflow
act -j lint
```

---

## 📁 Project Structure

```
.
├── docker-compose.dev.yml      # Development Docker configuration
├── docker-compose.prod.yml     # Production Docker configuration
├── Dockerfile                  # Docker image definition
├── drizzle.config.js           # Drizzle ORM configuration
├── jest.config.mjs             # Jest testing configuration
├── eslint.config.js            # ESLint configuration
├── .env.example                # Example environment variables
├── package.json                # Project dependencies
├── package-lock.json           # Locked dependency versions
│
├── .github/                    # GitHub configuration
│   └── workflows/              # GitHub Actions workflows
│       ├── lint-and-format.yml
│       ├── tests.yml
│       └── docker-build-and-push.yml
│
├── drizzle/                    # Database migrations
│   └── migrations/
│
├── src/                        # Source code
│   ├── app.js                  # Express app configuration
│   ├── index.js                # Application entry point
│   ├── server.js               # Server setup
│   ├── config/                 # Application configuration
│   ├── controllers/            # Request handlers & business logic
│   ├── middleware/             # Express middleware
│   ├── models/                 # Database schemas
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic layer
│   ├── utils/                  # Utility functions
│   └── validations/            # Request validation schemas
│
├── tests/                      # Automated test suite
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test data
│
├── logs/                       # Application logs
├── coverage/                   # Test coverage reports
├── scripts/                    # Utility scripts
├── README.md                   # This file
└── LICENSE                     # MIT License
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code passes all tests and follows the project's code standards before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

[⬆ Back to Top](#acquisitions-api)

</div>
