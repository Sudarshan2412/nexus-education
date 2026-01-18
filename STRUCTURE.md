# 📁 Nexus Education - Project Structure

## Overview
This document outlines the organized folder structure of the Nexus Education LMS application.

## 📂 Directory Structure

```
nexus-education-main/
├── prisma/                      # Database schema and migrations
│   └── schema.prisma           # Prisma schema definition
│
├── public/                      # Static assets
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── courses/       # Course CRUD operations
│   │   │   ├── search/        # Search functionality
│   │   │   └── upload/        # File upload endpoints
│   │   │
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   │
│   │   ├── courses/           # Course pages
│   │   │   ├── [id]/          # Individual course page
│   │   │   └── page.tsx       # All courses page
│   │   │
│   │   ├── instructor/        # Instructor dashboard
│   │   │   └── courses/       # Instructor course management
│   │   │
│   │   ├── my-learning/       # Student's enrolled courses
│   │   ├── profile/           # User profile page
│   │   ├── search/            # Search page
│   │   │
│   │   ├── globals.css        # Global styles (Remix theme)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   │
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   │   └── Header.tsx    # Main navigation header
│   │   │
│   │   ├── courses/          # Course-related components
│   │   │   ├── CourseCard.tsx    # Course card display
│   │   │   └── VideoUpload.tsx   # Video upload component
│   │   │
│   │   ├── home/             # Home page sections
│   │   │   ├── Hero.tsx      # Hero section
│   │   │   ├── Features.tsx  # Features section (vertical slides)
│   │   │   ├── Categories.tsx # Categories section
│   │   │   └── CTA.tsx       # Call-to-action section
│   │   │
│   │   ├── shared/           # Shared/common components
│   │   │   └── Providers.tsx # NextAuth & other providers
│   │   │
│   │   └── index.ts          # Centralized exports
│   │
│   ├── lib/                  # Utility functions
│   │   ├── prisma.ts         # Prisma client instance
│   │   ├── r2.ts             # Cloudflare R2 storage utilities
│   │   └── utils.ts          # General utilities
│   │
│   └── types/                # TypeScript type definitions
│       └── next-auth.d.ts    # NextAuth type extensions
│
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Design System

### Theme: Remix Landing Page
- **Primary Color**: Neon Cyan (#00D9FF / hsl(187, 100%, 50%))
- **Accent Colors**: Neon Green, Purple, Orange, Pink
- **Typography**: Space Grotesk (display), Poppins (body)
- **Background**: Deep dark blue-gray (hsl(222, 47%, 5%))

### Key Features:
- Glass morphism cards with backdrop blur
- Vertical slide animations
- Neon glow effects on hover
- Gradient text animations
- Responsive grid layouts

## 🗂️ Component Organization

### Layout Components (`/layout`)
Components that define the overall page structure:
- Header (Navigation, Auth state)

### Course Components (`/courses`)
Components specific to course functionality:
- CourseCard (Display course information)
- VideoUpload (Handle video uploads to R2)

### Home Components (`/home`)
Sections for the landing page:
- Hero (Main banner with CTA)
- Features (8 features in vertical slides)
- Categories (8 categories with course counts)
- CTA (Final call-to-action)

### Shared Components (`/shared`)
Reusable across the application:
- Providers (NextAuth, Theme providers)

## 🔧 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Storage**: Cloudflare R2
- **UI Icons**: Lucide React

## 📝 Import Patterns

### Recommended Import Style:
```tsx
// Using centralized exports
import { Header, CourseCard } from '@/components'

// Or direct imports
import { Header } from '@/components/layout/Header'
import { CourseCard } from '@/components/courses/CourseCard'
```

## 🚀 Development Workflow

1. **Components**: Create new components in their respective folders
2. **Pages**: Add new pages in `/app` directory
3. **API Routes**: Add endpoints in `/app/api`
4. **Styles**: Modify `globals.css` for global styles
5. **Types**: Add type definitions in `/types`

## 📦 File Naming Conventions

- **Components**: PascalCase (e.g., `Header.tsx`, `CourseCard.tsx`)
- **Pages**: lowercase with hyphens (e.g., `my-learning`, `sign-in`)
- **API Routes**: lowercase (e.g., `route.ts`)
- **Utilities**: camelCase (e.g., `prisma.ts`, `utils.ts`)

---

**Last Updated**: January 18, 2026
**Version**: 2.0 (Remix Theme)
