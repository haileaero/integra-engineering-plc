# INTEGRA Engineering PLC — Admin Ready Final

This is the INTEGRA Engineering PLC website project based on the approved sketch.

## Run locally

1. Open this folder in VS Code. The folder must contain `package.json` directly.
2. Open PowerShell in this folder.
3. Run:

```powershell
npm install
npm run dev
```

4. Open the Vite URL shown in the terminal, normally `http://localhost:5173/`.

## Admin

Open:

`http://localhost:5173/#admin`

The admin dashboard is prepared for Supabase authentication, database and storage. Until Supabase is configured, the site can save content in the browser's local storage for testing.

## Navigation fix

The active navigation item now follows the section currently visible on screen. The Projects link will be highlighted when the Projects section is visible, About when About is visible, and so on.

## Logo

The website uses the official INTEGRA Engineering PLC logo supplied for this project at `public/assets/logo.png`.

## Deployment

For Vercel, deploy the project root — the folder containing `package.json` — and configure the Supabase environment variables from `.env.example` when Supabase is ready.
