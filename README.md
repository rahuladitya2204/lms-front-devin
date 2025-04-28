# Testmint.ai LMS Frontend

This is a **Next.js** project, originally built using **Create React App (CRA)** and later migrated to Next.js.  
It uses a custom shared library: **@adewaskar/lms-common**.

## Setup Instructions

```bash
# 1. Install dependencies
yarn install

# 2. Build the project
yarn build

# 3. Start the development server
yarn dev
```

## Local Access Setup

Edit your `/etc/hosts` file and add:

```plaintext
127.0.0.1   www.nimblebee.local
```

Then access your frontend at:

```
http://www.nimblebee.local:3000
```

## Notes

- Use Node 18
- Always use **yarn** for dependency management.

---

# Quick Commands

```bash
# Install deps
yarn install

# Development server
yarn dev

# Production build
yarn build

# Edit hosts
sudo nano /etc/hosts
# Add:
# 127.0.0.1 www.nimblebee.local

# Then open
http://www.nimblebee.local:3000
```


# Important Environment

Make sure the following environments are set properly:

```bash
NODE_ENV=development # for dev
NODE_ENV=production  # for production build
```

The project uses `.env.development` and `.env.production` files.