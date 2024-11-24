import { NextResponse } from 'next/server';
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();


export async function GET(request) {
  console.log(request.param, '')
  const req = new URL(request.url);
  const { protocol, host, pathname } = req;
  const hostParts = host.split('.');
  const apiUrl = process.env.NEXT_API_URL;
  let subdomain = '';

  // Extract subdomain if available
  if (hostParts.length > 2) {
    subdomain = hostParts[0];
  }
  const categoryId = pathname.split('/')[2];

  // console.log(categoryId,'kya bat pyq!')
  // console.log(categoryId,pathname, 'categoryIdcategoryIdcategoryId');
  // return;
  try {
    // Fetch the URLs from your API, which returns an array of objects with url and priority
    const { data: urls } = await axios.get(
      `${apiUrl}/web/sitemap?subdomain=${subdomain || 'www'}&category=${categoryId}&pyq=true`
    );

    // console.log(urls, host);

    // Generate the sitemap XML using the fetched URLs with their respective priorities
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
        .map(({ url, priority, frequency }) => {
          return `
              <url>
                <loc>${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                ${frequency ? `<changefreq>${frequency || 'daily'}</changefreq>` : ''}
                ${priority ? `<priority>${priority}</priority>` : ''}
              </url>
            `;
        })
        .join('')}
      </urlset>`;

    // Set the response headers and return the sitemap XML
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error.message);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
