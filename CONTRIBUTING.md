# Contributing to CollabClass 🚀

Thank you for your interest in contributing to **CollabClass**! We welcome community contributions, bug reports, and feature requests.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9+
- **Docker & Docker Compose** (optional, for containerized testing)
- API Keys: Clerk, Stream.io, Groq, Supabase, GitHub Personal Access Token

### 2. Quickstart
Clone the repository and install all dependencies:

```bash
git clone https://github.com/TanmayNileshShinde/collabnclass.git
cd collabnclass
npm run install:all
```

Set up environment files:
- Copy `backend/.env.example` to `backend/.env` and fill in credentials.
- Copy `frontend/.env.example` to `frontend/.env` and fill in credentials.

Run both servers concurrently:
```bash
npm run dev
```

- **Frontend:** http://localhost:3000 (or http://localhost:5173)
- **Backend API:** http://localhost:4000

---

## 🐳 Docker Workflow

To build and run both services with Docker Compose:

```bash
docker compose up --build
```

Ensure `.env` files exist in `./backend/.env` and `./frontend/.env` before launching containers.

---

## 🌿 Contribution Guidelines

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Commit Convention:**
   Follow Conventional Commits:
   - `feat(scope): ...` for new features
   - `fix(scope): ...` for bug fixes
   - `docs(scope): ...` for documentation updates
   - `chore(scope): ...` for dependencies and configuration

3. **Verify Locally:**
   - Ensure frontend builds without type errors: `npm run build:frontend`
   - Ensure backend compiles cleanly: `npm run build:backend`

4. **Submit a Pull Request:**
   - Push your branch to your fork.
   - Open a pull request against `main`.
   - Provide a clear summary of changes and testing instructions in your PR description.
