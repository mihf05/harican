# **Harican**

Harican is a full-stack web application built with a **Node.js + Prisma backend** and a **Next.js frontend powered by Bun**.
It features AI-powered job matching, CV generation, career roadmaps, and more.

**AI Model:** Gemini 2.0 Flash

---

## **🚀 Quick Start**

```bash
# Clone the repository
git clone https://github.com/mihf05/harican.git
cd harican

# Setup backend
cd server
cp .env.example .env  # Edit .env with your values
npm install
npm run db:push  # Setup database
npm run db:seed  # Seed initial data
npm run dev

# Setup frontend (in new terminal)
cd ../client
cp .env.example .env.local  # Edit .env.local with your values
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **📋 Prerequisites**

- **Node.js** (v18 or higher)
- **Bun** (for frontend package management)
- **PostgreSQL** (v13 or higher)
- **Git**

---

## **📦 Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mihf05/harican.git
   cd harican
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   bun install
   ```

---

## **🔧 Environment Setup**

### **Backend (.env)**
Copy `server/.env.example` to `server/.env` and configure:

```env
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/harican"

# Google Gemini AI API Key
GEMINI_API_KEY="your_api_key_from_google_ai_studio"

# Random secret for authentication
BETTER_AUTH_SECRET="generate_random_string_here"

# Frontend URL
CLIENT_URL="http://localhost:3000"

# Optional: SMS service for OTP
BULKSMSBD_API_KEY="your_sms_api_key"
BULKSMSBD_SENDER_ID="your_sender_id"
BULKSMSBD_URL="https://api.bulksmsbd.net"

# Environment
NODE_ENV="development"
```

### **Frontend (.env.local)**
Copy `client/.env.example` to `client/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## **🏃 Running the Application**

### **Database Setup**
```bash
cd server
npm run db:push    # Push schema to database
npm run db:seed    # Seed with sample data
```

### **Development Mode**
```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
cd client
bun run dev
```

### **Production Mode**
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
bun run build
bun start
```

---

## **📜 Available Scripts**

### **Backend Scripts**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run build` | Generate Prisma client |

### **Frontend Scripts**
| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun start` | Start production server |

---

## **🛠️ Technologies Used**

### **Backend**
- Node.js
- Prisma ORM
- PostgreSQL
- Express.js
- Google Gemini AI

### **Frontend**
- Next.js 16
- Bun
- Tailwind CSS
- TypeScript

---

## **📁 Project Structure**

```
harican/
├── server/          # Backend (Node.js + Prisma)
├── client/          # Frontend (Next.js)
└── README.md
```

