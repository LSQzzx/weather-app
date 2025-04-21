# Weather-app

### A weather web app using Next.js based on OpenMeter weather data (DWD Global ICON weather Model)

<div class="donate-container">
  <div class="donate-card">
    <a href="https://ko-fi.com/sp1der" class="donate-btn" target="_blank">Buy me a coffee ☕️</a>
  </div>
</div>

<image src="images/weather-app.jpg">

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<style>
.donate-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 2rem 0;
  font-family: inherit;
}

.donate-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  width: auto;
  min-width: 220px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.donate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.donate-btn {
  background-color: #3498db;
  color: white !important;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none !important;
  display: inline-block;
  margin: 0.5rem;
}

.donate-btn:hover {
  background-color: #2980b9;
  color: white !important;
  text-decoration: none !important;
}
</style>