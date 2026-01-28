# api_bun - Multi-tenant SaaS API Boilerplate

A professional, scalable, and modular SaaS API boilerplate built with **Bun.js**, **ElysiaJS**, and **Mongoose**.

## 🚀 Technologies

- **Runtime:** [Bun.js](https://bun.sh/) (Latest)
- **Framework:** [ElysiaJS](https://elysiajs.com/)
- **ORM:** [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Auth:** [BetterAuth](https://www.better-auth.com/) with JWT
- **Documentation:** [Swagger](https://elysiajs.com/plugins/swagger.html)
- **Validation:** [Zod](https://zod.dev/) (via Elysia TypeBox/t)
- **Payments:** [Stripe](https://stripe.com/)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Architecture:** Clean Architecture, SOLID, Repository Pattern

## 📂 Project Structure

```text
src/
├── application/      # Use Cases & DTOs (Business Logic)
├── core/             # Global Config, Errors, Logger
├── domain/           # Entities & Repository Interfaces (Enterprise Rules)
├── infrastructure/   # DB, Repositories Impl, External Services (Stripe, Email)
├── presentation/     # Controllers, Routes, Middlewares
├── shared/           # Utils & Constants
└── tests/            # Automated Tests
```

## 🛠️ Installation

1. **Install Bun:**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install Dependencies:**
   ```bash
   bun install
   ```

3. **Environment Variables:**
   Fill in your credentials in the `.env` file.

4. **Run Development Server:**
   ```bash
   bun run src/index.ts
   ```

5. **Run Tests:**
   ```bash
   bun test
   ```

## 📖 API Documentation

Once the server is running, access the Swagger documentation at:
`http://localhost:3000/doc`

## 🔑 Key Features

- **Multi-tenancy:** Built-in structure for tenant isolation.
- **Clean Architecture:** Decoupled layers for easy maintenance and database swapping.
- **Error Handling:** Global middleware with custom API error classes.
- **Logging:** Native Bun logging to files in `/logs`.
- **SaaS Workflow:** User registration -> Email verification -> Subscription -> Admin privileges.

## 📜 Business Rules

- **Roles:** `ADMIN`, `OWNER`, `MANAGER`, `USER`.
- **Registration:** Users start as `inactive` with `USER` role.
- **Verification:** Account activation via email code.
- **Upgrading:** Upon subscription, users are promoted to `ADMIN` (Tenant Owner) to manage their own users.
