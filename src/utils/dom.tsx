import { load } from 'cheerio';
import { useEffect, useState } from 'react';
import { Window } from '../types/constants';
import { debounce } from './data';

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
    let content = $(element).attr('content') || '';

    // Remove "og:" prefix from property name
    const propertyName = property.replace('og:', '');
    ogMetaTags[propertyName] = content;

    // Check if the content is a relative URL and make it absolute
    if (baseUrl && propertyName === 'image' && !content.startsWith('http')) {
      if (!content.startsWith('/')) content = '/' + content;
      ogMetaTags[propertyName] = baseUrl + content;
    } else {
      ogMetaTags[propertyName] = content;
    }
  });

  return ogMetaTags;
}

export const useDimensionWindow = () => {
  const [width, setWidth] = useState(Window().innerWidth);
  const [height, setHeight] = useState(Window().innerHeight);

  const debouncedWidth = debounce(setWidth, 200);
  const debouncedHeight = debounce(setHeight, 200);

  useEffect(() => {
    const handleResize = () => {
      debouncedWidth(Window().innerWidth);
      debouncedHeight(Window().innerHeight);
    };
    Window().addEventListener('resize', handleResize);
    return () => {
      Window().removeEventListener('resize', handleResize);
    };
  }, []);
  return { width, height };
};
