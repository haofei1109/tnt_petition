# Deployment Guide (Vercel + China Access)

## 1. Prerequisites

- A Vercel account.
- A GitHub repository (push this code to GitHub).
- A Google Gemini API Key.
- A Custom Domain (Required for access in China).

## 2. Database Setup (Vercel Postgres)

1. Go to your Vercel Project Dashboard.
2. Click on "Storage" tab.
3. Click "Connect Store" -> "Create New" -> "Postgres".
4. Follow the steps to create the database.
5. Once created, go to the "Data" tab (or use the "Query" tool in Vercel dashboard) and run the following SQL to create the tables:

```sql
CREATE TABLE petitions (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  author VARCHAR(255) NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE signatures (
  id VARCHAR(255) PRIMARY KEY,
  petition_id VARCHAR(255) REFERENCES petitions(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  timestamp BIGINT NOT NULL
);
```

6. Vercel will automatically add the necessary environment variables (`POSTGRES_URL`, etc.) to your project.

## 3. Environment Variables

Go to "Settings" -> "Environment Variables" in your Vercel project and add:

- `GOOGLE_API_KEY`: Your Google Gemini API Key.

## 4. China Access Strategy

To ensure the application works in China:

1. **Custom Domain**: You **must** bind a custom domain (e.g., `www.your-petition-site.com`) to your Vercel project. The default `*.vercel.app` domains are often DNS polluted or blocked in China.
2. **API Proxy**: This project has been configured to proxy all Google API calls through Vercel's backend (`api/veo/...`). This means the user's browser in China talks to Vercel (via your custom domain), and Vercel talks to Google. This bypasses the GFW blocking of Google services.

## 5. Local Development

To run the project locally with API functions:

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Pull env vars: `vercel env pull .env.local`
4. Run: `vercel dev` (This runs both the Vite frontend and the API functions).

## 6. Deployment

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Configure the Environment Variables.
4. Deploy.
5. Add your Custom Domain in Vercel Settings -> Domains.
