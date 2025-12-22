# Getting Started with the Learning Management System

## Initial Setup

### 1. Database Setup

You need PostgreSQL installed. You can either:

**Option A: Local PostgreSQL**
- Install PostgreSQL from https://www.postgresql.org/download/
- Create a new database:
```sql
CREATE DATABASE lms_db;
```

**Option B: Use a cloud database**
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - Simple deployment

### 2. Configure Environment Variables

Update the `.env` file with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-32-char-string-here"
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 3. Initialize Database

Run these commands to set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Create Your First User

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Choose either "Learn" (Student) or "Teach" (Instructor)
4. Fill in your details and create account
5. Sign in with your credentials

### For Students:
- Browse courses at `/courses`
- View course details
- Enroll in courses (once created by instructors)
- View profile at `/profile`

### For Instructors:
- Access instructor dashboard at `/instructor/courses`
- Create new courses
- Add videos, materials, exercises
- Manage your courses

## Database Schema Overview

The application includes these main models:

- **User** - User accounts with roles (STUDENT, INSTRUCTOR, ADMIN)
- **Course** - Course information, category, pricing
- **Video** - Video lectures within courses
- **Material** - PDF, documents, slides associated with videos/courses
- **Exercise** - MCQ and coding exercises
- **ExerciseSubmission** - Student answers and scores
- **CodeRepository** - GitHub repository links
- **Enrollment** - Student course enrollments with progress tracking

## Features to Implement Next

### Priority Features:
1. **Video Upload** - Integrate with cloud storage (AWS S3, Cloudflare R2)
2. **Enrollment System** - Allow students to enroll in courses
3. **Course Creation** - Full CRUD interface for instructors
4. **Exercise System** - MCQ creation and automatic grading
5. **Progress Tracking** - Track video completion and course progress

### Advanced Features:
- Payment integration (Stripe)
- Video streaming with progress markers
- Real-time discussions/chat
- Certificate generation
- Email notifications
- Course ratings and reviews
- Search with filters
- Admin dashboard

## API Routes

The application includes these API endpoints:

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema changes
npx prisma migrate dev  # Create migration
npx prisma generate     # Regenerate Prisma Client

# Linting
npm run lint            # Run ESLint
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify database exists: `psql -U postgres -l`

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check for TypeScript errors: `npx tsc --noEmit`

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set in `.env`
- Clear browser cookies/cache
- Check NEXTAUTH_URL matches your domain

## Project Structure

```
DTL/
├── .github/
│   └── copilot-instructions.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Auth pages
│   │   ├── courses/          # Course pages
│   │   ├── instructor/       # Instructor dashboard
│   │   ├── profile/          # User profile
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── CourseCard.tsx
│   │   ├── Header.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   └── prisma.ts         # Prisma client
│   └── types/
│       └── next-auth.d.ts    # TypeScript definitions
├── .env                       # Environment variables
├── .env.example              # Example env file
├── next.config.js            # Next.js config
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)
- See [NextAuth.js docs](https://next-auth.js.org)
