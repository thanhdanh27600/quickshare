import { load } from 'cheerio';

export function extractBaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (error) {
    return '';
  }
}

export function extractOgMetaTags(htmlString: string, baseUrl?: string): Record<string, string> {
  const ogMetaTags: Record<string, string> = {};

  // Load the HTML string into Cheerio
  const $ = load(htmlString);

  // Find all meta tags with property starting with "og:"
  $('meta[property^="og:"]').each((_, element) => {
    const property = $(element).attr('property') || '';
    const content = $(element).attr('content') || '';

    // Remove "og:" prefix from property name
    const propertyName = property.replace('og:', '');
    ogMetaTags[propertyName] = content;

    // Check if the content is a relative URL and make it absolute
    if (baseUrl && propertyName === 'image' && content.startsWith('/')) {
      ogMetaTags[propertyName] = baseUrl + content;
    } else {
      ogMetaTags[propertyName] = content;
    }
  });

  return ogMetaTags;
}
