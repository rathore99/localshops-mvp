# LocalShops — Git Setup & Command Reference

> This document records every git command used to set up and manage this repository.
> Follow this guide to reproduce the setup from scratch or onboard a new developer.

---

## 1. Prerequisites

```bash
# Verify git is installed
git --version
# Expected: git version 2.39.x or higher

# Verify your identity is set globally
git config user.name
git config user.email

# If not set, configure now:
git config --global user.name "rahul"
git config --global user.email "sriturajrathore99@gmail.com"
```

---

## 2. Repository Initialization

```bash
# Navigate to project folder
cd /c/rahul-projects/localShops

# Initialize git with 'main' as the default branch
git init -b main

# If git version < 2.28 (does not support -b flag), use:
git init
git branch -m master main
```

---

## 3. Line Ending Configuration (Windows)

```bash
# Tell git to convert LF to CRLF on checkout (Windows standard)
git config core.autocrlf true

# Or set globally for all repos on this machine:
git config --global core.autocrlf true
```

---

## 4. First Commit — Project Planning Files

```bash
# Stage all planning documents, prototype files, and config
git add .gitignore
git add DEVELOPMENT_RULES.md
git add "Tech analysis summary.md"
git add info.md
git add mvp-final.md
git add plan.md
git add postman/
git add testing/
git add index.html reserve.html shop-dashboard.html shop-details.html styles.css

# Verify what is staged
git status

# Create the initial commit
git commit -m "chore: initial project setup — planning docs, MVP scope, dev rules, and HTML prototype"

# View the commit
git log --oneline
```

---

## 5. Branch Strategy

This project uses a **feature-branch workflow**:

```
main                    ← production-ready; only merged code that passed approval gates
develop                 ← integration branch; merge feature branches here first
feature/week1-*         ← foundation scaffolding (no business logic)
feature/feature-N-*     ← one branch per MVP feature
```

### Branch naming convention
```
feature/{N}-{short-description}
# Examples:
feature/feature-1-shop-listing
feature/feature-3-reservation
```

### Rules
- Never commit directly to `main`
- Merge to `develop` first, then `develop` → `main` after approval
- Delete feature branches after merging

---

## 6. Creating All Feature Branches

```bash
# Create integration branch
git checkout -b develop
git checkout main

# Week 1 — Foundation
git checkout -b feature/week1-foundation
git checkout main

# Feature 1 — Shop Listing
git checkout -b feature/feature-1-shop-listing
git checkout main

# Feature 2 — Product Search
git checkout -b feature/feature-2-product-search
git checkout main

# Feature 3 — Reservation
git checkout -b feature/feature-3-reservation
git checkout main

# Feature 4 — Admin Auth
git checkout -b feature/feature-4-admin-auth
git checkout main

# Feature 5 — Admin Shop CRUD
git checkout -b feature/feature-5-admin-shop-crud
git checkout main

# Feature 6 — Admin Product CRUD
git checkout -b feature/feature-6-admin-product-crud
git checkout main

# Feature 7 — Admin Reservations
git checkout -b feature/feature-7-admin-reservations
git checkout main

# Verify all branches
git branch -a
```

Expected output:
```
  develop
  feature/feature-1-shop-listing
  feature/feature-2-product-search
  feature/feature-3-reservation
  feature/feature-4-admin-auth
  feature/feature-5-admin-shop-crud
  feature/feature-6-admin-product-crud
  feature/feature-7-admin-reservations
  feature/week1-foundation
* main
```

---

## 7. Create Remote Repository on GitHub

### Option A — Using GitHub CLI (recommended if gh is installed)

```bash
# Install gh CLI: https://cli.github.com/
# Then authenticate:
gh auth login

# Create the remote repo (private, under your account)
gh repo create localshops-mvp \
  --private \
  --description "LocalShops — PWA marketplace for local shops in small-town India" \
  --source=. \
  --remote=origin \
  --push
```

### Option B — Using GitHub REST API with curl

```bash
# Replace YOUR_PAT with a GitHub Personal Access Token
# Token needs: repo scope
# Generate at: https://github.com/settings/tokens

curl -X POST https://api.github.com/user/repos \
  -H "Authorization: token YOUR_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "localshops-mvp",
    "description": "LocalShops — PWA marketplace for local shops in small-town India",
    "private": true,
    "auto_init": false
  }'

# After the repo is created, add the remote:
git remote add origin https://github.com/rathore99/localshops-mvp.git

# Verify remote was added:
git remote -v
```

### Option C — Manual via GitHub website
1. Go to https://github.com/new
2. Repository name: `localshops-mvp`
3. Description: `LocalShops — PWA marketplace for local shops in small-town India`
4. Set to **Private**
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"
7. Then run:

```bash
git remote add origin https://github.com/rathore99/localshops-mvp.git
git remote -v
```

---

## 8. Authenticate for HTTPS Push (Windows)

```bash
# When you push for the first time, Windows will prompt for credentials.
# Use your GitHub username and a Personal Access Token (NOT your password).
# GitHub removed password auth in 2021 — PAT is required.

# To avoid entering credentials every push, cache them:
git config --global credential.helper manager-core
# Windows Credential Manager will store the token after first successful push.

# Or store in memory for the session (1 hour):
git config credential.helper 'cache --timeout=3600'
```

---

## 9. Push All Branches to Remote

```bash
# Push main branch (sets upstream tracking)
git push -u origin main

# Push develop
git push -u origin develop

# Push all feature branches at once
git push -u origin feature/week1-foundation
git push -u origin feature/feature-1-shop-listing
git push -u origin feature/feature-2-product-search
git push -u origin feature/feature-3-reservation
git push -u origin feature/feature-4-admin-auth
git push -u origin feature/feature-5-admin-shop-crud
git push -u origin feature/feature-6-admin-product-crud
git push -u origin feature/feature-7-admin-reservations

# Or push all local branches to remote in one command:
git push --all origin

# Verify remote branches exist:
git branch -r
```

---

## 10. Branch Protection

GitHub branch protection rules require GitHub Pro ($4/month) for private repos.
Since this is a solo project, we use a **local git pre-push hook** instead.

### Pre-push hook (already installed at `.git/hooks/pre-push`)
Blocks any direct push to `main` or `develop`. You must always work on a feature
branch and open a PR.

```bash
# The hook is at .git/hooks/pre-push — it runs automatically on every git push.
# To verify it is active, try pushing directly to main — it will be rejected:
git checkout main
git push origin main
# → ERROR: Direct push to 'main' is not allowed.

# To reinstall on a new clone (hooks are not tracked by git):
cp .git/hooks/pre-push /path/to/new-clone/.git/hooks/pre-push
chmod +x /path/to/new-clone/.git/hooks/pre-push
```

### Note on GitHub Free vs Pro
- GitHub Free: branch protection NOT enforced on private repos
- GitHub Pro ($4/month): branch protection enforced on private repos
- GitHub Team ($4/user/month): rulesets + organization features
- Alternative: make the repo public — branch protection is free on public repos

---

## 11. Day-to-Day Workflow

### Starting work on a feature

```bash
# Always start from main, up to date
git checkout main
git pull origin main

# Switch to the feature branch
git checkout feature/feature-1-shop-listing

# Merge latest main into feature branch to stay current
git merge main
```

### Committing work

```bash
# Stage specific files (never use git add -A blindly)
git add backend/src/main/java/com/localshops/service/ShopService.java
git add backend/src/test/java/com/localshops/service/ShopServiceTest.java

# Check what is staged
git status
git diff --staged

# Commit with conventional commit message
git commit -m "feat(shop): add ShopService with active shop filter and not-found exception"
```

### Commit message format

```
<type>(<scope>): <short description>

Types:
  feat     — new feature
  fix      — bug fix
  test     — adding or updating tests
  chore    — build, tooling, config (no production code)
  docs     — documentation only
  refactor — code change that is not a fix or feature
  style    — formatting only (no logic change)

Examples:
  feat(shop): add GET /shops endpoint with active filter
  test(shop): add ShopServiceTest unit tests for active filter and not-found
  fix(reservation): normalize phone number to E.164 before saving
  chore(ci): add GitHub Actions workflow for backend tests
```

### Pushing and opening a PR

```bash
# Push feature branch to remote
git push origin feature/feature-1-shop-listing

# Open a pull request on GitHub:
# https://github.com/rathore99/localshops-mvp/compare/main...feature/feature-1-shop-listing
# Title: "Feature 1: Shop Listing — GET /shops, GET /shops/{id}, GET /categories"
# Body: reference the manual test plan sign-off and paste CI results
```

### After PR approval — merging

```bash
# Merge PR via GitHub UI (Squash and Merge recommended to keep main history clean)
# Then locally:
git checkout main
git pull origin main

# Delete local feature branch (it's merged, no longer needed)
git branch -d feature/feature-1-shop-listing

# Delete remote feature branch
git push origin --delete feature/feature-1-shop-listing
```

---

## 12. Useful Everyday Commands

```bash
# See current branch and status
git status

# See all local branches
git branch

# See all local + remote branches
git branch -a

# See recent commits (one line each)
git log --oneline -10

# See full commit graph
git log --oneline --graph --all

# See what changed in last commit
git show HEAD

# See diff of unstaged changes
git diff

# See diff of staged changes
git diff --staged

# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Discard all uncommitted changes in a file (careful — irreversible)
git checkout -- path/to/file

# Stash work in progress to switch branches
git stash
git stash pop   # restore stashed changes

# List stashes
git stash list
```

---

## 13. Tagging Releases

```bash
# After go-live / after a sprint completes successfully:
git tag -a v0.1.0 -m "MVP Sprint 1 — Foundation"
git push origin v0.1.0

# After feature 1 approved and merged:
git tag -a v0.2.0 -m "Feature 1: Shop Listing live"
git push origin v0.2.0

# List all tags
git tag -l
```

---

## 14. If You Need to Start Over (Emergency Reset)

```bash
# WARNING: This destroys all local uncommitted changes
# Only use if something is seriously broken

# Reset to last commit
git reset --hard HEAD

# Reset local branch to match remote main exactly
git fetch origin
git reset --hard origin/main
```

---

## 15. Repository Structure Reference

```
localshops-mvp/               ← git root
├── .github/
│   └── workflows/
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
├── backend/                  ← Spring Boot (Java 17 + Maven)
├── frontend/                 ← React 18 + Vite + Tailwind
├── postman/                  ← Postman collections (one per feature)
├── testing/
│   └── manual/               ← Manual test plan per feature
├── db/
│   └── seed/                 ← Seed data SQL (dev profile only)
├── .gitignore
├── DEVELOPMENT_RULES.md
├── git.md                    ← This file
├── mvp-final.md
└── plan.md
```

---

## 16. Remote Repository Info

| Item | Value |
|---|---|
| GitHub username | rathore99 |
| Repository name | localshops-mvp |
| Repository URL | https://github.com/rathore99/localshops-mvp |
| Clone URL (HTTPS) | https://github.com/rathore99/localshops-mvp.git |
| Visibility | Private |
| Default branch | main |

---

## 17. Clone This Repo (for a new machine or teammate)

```bash
git clone https://github.com/rathore99/localshops-mvp.git
cd localshops-mvp

# See all remote branches
git branch -r

# Check out a feature branch locally
git checkout -b feature/feature-1-shop-listing origin/feature/feature-1-shop-listing
```
