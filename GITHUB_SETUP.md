# GitHub Setup Guide

## Quick Setup (Choose Your Repository Name)

### Suggested Repository Names:
- `learning-hub`
- `skillforge-lms`
- `eduflow`
- `coursemate`
- `academy-platform`
- `learnspace`
- `knowledge-base-lms`
- `studysphere`
- `edu-nexus`
- `campus-online`

## Steps to Push to GitHub:

### 1. Create a New Repository on GitHub

1. Go to https://github.com/new
2. Choose a repository name (use one from suggestions above or your own)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Choose visibility: Public or Private
5. Click "Create repository"

### 2. Push Your Code

After creating the repository, run these commands (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/imsuk/eduflow.git
git branch -M main
git push -u origin main
```

### 3. Invite Your Teammates

1. Go to your repository on GitHub
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Enter their GitHub username or email
5. Choose their permission level:
   - **Write**: Can push code
   - **Maintain**: Can manage issues and PRs
   - **Admin**: Full access

## Collaboration Setup

### Branch Protection (Recommended)

To ensure code quality:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Set branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution before merging

### Environment Secrets

For team deployment:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `AWS_ACCESS_KEY_ID` (if using S3)
   - `AWS_SECRET_ACCESS_KEY`

## Team Workflow

### For Teammates to Get Started:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Then edit .env with their database credentials

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Creating a New Feature:

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes...

# Commit changes
git add .
git commit -m "Add: your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub
```

## Useful GitHub Features

### Issues
- Create issues for bugs, features, or tasks
- Assign to team members
- Use labels: `bug`, `enhancement`, `documentation`

### Projects
- Use GitHub Projects for kanban-style task management
- Create boards: To Do, In Progress, Done

### Actions (CI/CD)
- Automatically run tests on PRs
- Deploy to production on merge to main

### Wiki
- Document architecture decisions
- API documentation
- Development guides

## Repository Settings Checklist

- [ ] Add repository description and topics
- [ ] Enable Issues
- [ ] Enable Projects
- [ ] Add branch protection rules
- [ ] Set up environment secrets
- [ ] Create CONTRIBUTING.md
- [ ] Add LICENSE file
- [ ] Enable Dependabot for security updates

## Contributing Guide for Teammates

Share this with your team:

### Coding Standards
- Use TypeScript for type safety
- Follow existing code structure
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before pushing

### Commit Message Format
```
Type: Brief description

- Detail 1
- Detail 2

Examples:
Add: User profile page
Fix: Course enrollment bug
Update: Prisma schema for exercises
Refactor: Authentication flow
```

### Before Submitting a PR
1. ✅ Run `npm run build` to ensure no errors
2. ✅ Run `npm run lint` to check code style
3. ✅ Test your changes locally
4. ✅ Update documentation if needed
5. ✅ Write a clear PR description

## Need Help?

- 📖 [GitHub Docs](https://docs.github.com)
- 🤝 [Collaborating on GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- 🔀 [Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
