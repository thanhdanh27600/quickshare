import { load } from 'cheerio';

export function extractOgMetaTags(htmlString: string): Record<string, string> {
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
  });

  return ogMetaTags;
}
