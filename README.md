# **Harican**

Harican is a full-stack web application built with a **Node.js + Prisma backend** and a **frontend powered by Bun**.
Follow the steps below to clone, install, and run the project.

For AI  using gemini.
model gemini-2.0-flash

---

## **📦 Project Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/mihf05/harican.git
cd harican
```

---

## **🖥️ Backend Setup (Server)**

Navigate to the backend folder:

```bash
cd server
```

### **Install Dependencies**

```bash
npm i
```

### **Generate Prisma Client (Required)**

```bash
npm run postinstall
```

### **Run in Development Mode**

```bash
npm run dev
```

This uses **nodemon** to auto-reload your server.

### **Run in Production Mode**

```bash
npm run start
```

---

## **⚙️ Backend Scripts Overview**

These scripts are defined in `package.json`:

```json
"dev": "nodemon src/server.js",
"start": "node src/server.js",

"build": "prisma generate",
"postinstall": "prisma generate",

"db:generate": "prisma generate",
"db:push": "prisma db push",
"db:migrate": "prisma migrate dev",
"db:seed": "node prisma/seed.js"
```

### **What they do:**

| Script                                | Purpose                                           |
| ------------------------------------- | ------------------------------------------------- |
| **dev**                               | Starts server with nodemon (auto-reload).         |
| **start**                             | Starts server normally (production mode).         |
| **build / postinstall / db:generate** | Generates Prisma Client.                          |
| **db:push**                           | Pushes schema to the database without migrations. |
| **db:migrate**                        | Creates + applies a new Prisma migration.         |
| **db:seed**                           | Runs the database seeding script.                 |

---

## **🌐 Frontend Setup (Client)**

Navigate to the frontend:

```bash
cd ../client
```

### **Install Dependencies**

(Using **Bun**)

```bash
bun i
```

### **Run Development Server**

```bash
bun run dev
```

This will start the frontend development environment.

---

## **🛠️ Technologies Used**

### **Backend**

* Node.js
* Prisma ORM
* PostgreSQL
* Nodemon

### **Frontend**

* Bun & npm
* Next.JS 16


---

## **🚀 Running the Full Project**

**Backend**

```bash
cd server
npm i
npm run postinstall
npm run dev
```

**Frontend**

```bash
cd client
bun i
bun run dev
```

