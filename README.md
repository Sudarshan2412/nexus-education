# Learning Management System

A comprehensive learning management system built with Next.js 14, featuring video uploads, code repositories, course materials, exercises, and personalized learning experiences.

## Features

- 🔐 **User Authentication** - Secure sign up/sign in with NextAuth.js
- 🎓 **Course Management** - Create and manage courses with videos, materials, and exercises
- 💻 **Code Repositories** - Integrate GitHub repos directly into courses
- 📝 **Exercises & MCQs** - Create interactive exercises for students
- 📊 **Progress Tracking** - Track student progress and course completion
- 🔍 **Course Discovery** - Search and filter courses by category, level, and more
- 👤 **User Profiles** - View enrolled courses and created courses
- 🎯 **Role-Based Access** - Student, Instructor, and Admin roles

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd DTL
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes the following main models:

- **User** - User accounts with roles (Student/Instructor/Admin)
- **Course** - Course information and metadata
- **Video** - Video lectures within courses
- **Material** - Supplementary materials (PDFs, slides, etc.)
- **Exercise** - MCQs and coding exercises
- **CodeRepository** - GitHub repository integrations
- **Enrollment** - Student course enrollments and progress

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   ├── instructor/        # Instructor dashboard
│   └── profile/           # User profile
├── components/            # React components
├── lib/                   # Utility functions and configs
└── types/                 # TypeScript type definitions

prisma/
└── schema.prisma         # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Features to Implement

- [ ] Video upload to cloud storage (AWS S3)
- [ ] Real-time video player with progress tracking
- [ ] Exercise submission and grading system
- [ ] Certificate generation
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Course reviews and ratings
- [ ] Discussion forums

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
