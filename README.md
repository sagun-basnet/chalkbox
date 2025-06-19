# ChalkBox — Job & Workshop Platform


A peer-to-peer platform connecting students with jobs and workshops using **AI recommendations**, **Web3 contracts**, and a **token-based incentive system**.

---

## 🚀 Features

- **AI-Based Matching**: Matches users to jobs/workshops based on skills.
- **Peer Learning**: Workshops organized by students, for students.
- **Open Source Projects**: Hands-on learning after workshops.
- **Token System**: Earn tokens for engagement and growth.
- **Smart Contracts**: Web3-based job agreements between students and employers.
- **Decentralized Voting**: Resolve disputes via proof-based voting.

---

## ⚙️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB
- Prisma ORM

### Frontend
- React
- TypeScript
- Vite
- React Router

---

## 🧪 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB
- `pnpm` or `npm`

---

### Clone & Install

```bash
git clone https://github.com/nischaljs/chalkbox.git
cd chalkbox

# Install backend & frontend deps
cd backend && pnpm install
cd ../frontend && pnpm install
```

---

### Setup Environment

#### Backend `.env`
```env
DATABASE_URL="mongodb://localhost:27017/chalkbox"
JWT_SECRET="your-secret"
PORT=5000
```

#### Frontend `.env`
```env
VITE_API_URL="http://localhost:5000"
```

---

### DB Setup

```bash
cd backend
pnpm prisma generate
pnpm prisma db seed
```

---

### Run Dev Servers

```bash
# Backend
cd backend && pnpm dev

# Frontend
cd frontend && pnpm dev
```

---

## 👥 Seeded Users

| Name         | Email              | Role     | Badge             | Tokens |
|--------------|--------------------|----------|-------------------|--------|
| Admin        | admin@chalkbox.com | ADMIN    | N/A               | 1000   |
| Tech Employer| employer@chalkbox.com | EMPLOYER | GURU              | 500    |
| Startup Founder | startup@chalkbox.com | EMPLOYER | SIKSHA_SEVI     | 300    |
| Ram Sharma   | ram@chalkbox.com   | STUDENT  | UTSAAHI_INTERN    | 100    |
| Sita Thapa   | sita@chalkbox.com  | STUDENT  | UTSAAHI_INTERN    | 50     |

*Passwords: `password123`*

---

## 🏁This is a much-improved project Built By Our Team Trionerd @ IICQuest 3.0  
Role: Backend & Blockchain + AI Integration

Made with ❤️ during a 36-hour hackathon!
