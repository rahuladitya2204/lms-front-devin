import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request:Request) {
    console.log(request,'reqqq')
    const req = new URL(request.url);
const { protocol, host }=req;
const hostParts = host.split('.');
const apiUrl=process.env.API_URL;
let subdomain = '';
if (hostParts.length > 2) {
  subdomain = hostParts[0];
}
  // Fetch the URLs from your API
  const {data: urls} = await axios.get(`${apiUrl}/web/sitemap?subdomain=${subdomain}`);
  const currentDomain = `${protocol}//${host}`;
  console.log(urls,host)
  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map((url) => {
          return `
            <url>
            <loc>${currentDomain}${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  // Set the response headers and return the sitemap XML
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}