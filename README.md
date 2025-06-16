# ChalkBox - Job and Workshop Platform

ChalkBox is a comprehensive platform that connects students with job opportunities and educational workshops. The platform uses AI-based recommendations to match users with relevant jobs and workshops based on their skills.


## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- MongoDB

### Frontend
- React
- TypeScript
- React Router

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nischaljs/iicquest.git
cd iicquest
```

2. Install dependencies:
```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

3. Set up environment variables:
```bash
# Backend (.env)
DATABASE_URL="mongodb://localhost:27017/iicquest"
JWT_SECRET="your-jwt-secret"
PORT=5000

# Frontend (.env)
VITE_API_URL="http://localhost:5000"
```

4. Run database migrations:
```bash
cd backend
pnpm prisma generate
```

5. Seed the database:
```bash
pnpm prisma db seed
```

6. Start the development servers:
```bash
# Backend
cd backend
pnpm dev

# Frontend
cd frontend
pnpm dev
```

## Seeded Users

The database comes pre-seeded with multiple users for testing different scenarios:

### Admin
- Email: admin@chalkbox.com
- Password: password123
- Role: ADMIN
- Bio: Platform administrator
- Skills: JavaScript, TypeScript, Node.js, React, MongoDB
- Tokens: 1000
- Profile Picture: /profiles/admin.png

### Employers
1. Tech Employer
   - Email: employer@chalkbox.com
   - Password: password123
   - Role: EMPLOYER
   - Bio: Senior tech lead with 10+ years experience
   - Badge: GURU
   - Skills: System Design, Architecture, Team Leadership
   - Tokens: 500
   - Profile Picture: /profiles/employer.png

2. Startup Founder
   - Email: startup@chalkbox.com
   - Password: password123
   - Role: EMPLOYER
   - Bio: Entrepreneur passionate about tech education
   - Badge: SIKSHA_SEVI
   - Skills: Product Management, Agile, Startup
   - Tokens: 300
   - Profile Picture: /profiles/startup.png

### Students
1. Ram Sharma
   - Email: ram@chalkbox.com
   - Password: password123
   - Role: STUDENT
   - Bio: Passionate about web development
   - Badge: UTSAAHI_INTERN
   - Skills: JavaScript, React, Node.js
   - Tokens: 100
   - Profile Picture: /profiles/ram.png
   - History: React workshop attendance, Active contract for Backend Intern

2. Sita Thapa
   - Email: sita@chalkbox.com
   - Password: password123
   - Role: STUDENT
   - Bio: Frontend developer in training
   - Badge: UTSAAHI_INTERN
   - Skills: HTML, CSS, JavaScript, React
   - Tokens: 50
   - Profile Picture: /profiles/sita.png
   - History: React workshop attendance, Pending application for Frontend Intern
