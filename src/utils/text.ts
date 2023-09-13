import { toast } from 'react-hot-toast';

export function generateRandomString(numChars: number): string {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < numChars; i++) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return randomString;
}

// export function testGenerateRandomString(numChars: number): string {
//   const possibleChars = '123';
//   let randomString = '';
//   for (let i = 0; i < numChars; i++) {
//     randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
//   }
//   return randomString;
// }

export const truncate = (text: string, l = 30) => {
  return text.length <= l ? text : text.substring(0, l) + '...';
};

export const truncateMiddle = (text: string, length = 30, r = 5) => {
  return text.length <= length ? text : text.substring(0, length - r) + '...' + text.slice(-r);
};

export const urlRegex = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/i;
export const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/i;

export const isValidUrl = (urlString: string) => {
  return !!urlRegex.test(urlString);
};

export const copyToClipBoard = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // Make it invisible
  document.body.appendChild(textarea);
  // Select and copy the text inside the textarea
  textarea.select();
  document.execCommand('copy');
  // Clean up and remove the textarea
  document.body.removeChild(textarea);
};

export const capitalize = (string?: string) => {
  if (!string) return string;
  return string[0].toUpperCase() + string.slice(1);
};

export const share = (shareData: ShareData, t: any) => {
  // Check if the Web Share API is available in the browser
  if (navigator.share) {
    // Use the Web Share API to open the native sharing dialog
    navigator
      .share(shareData)
      .then(() => {
        console.log('Shared successfully');
      })
      .catch((error) => {
        console.error('Error sharing:', error);
      });
  } else {
    // Fallback for browsers that do not support the Web Share API
    // You can provide an alternative sharing mechanism here, like copying the link to the clipboard
    toast.error(t('errorSharing'));
    console.log('Web Share API is not supported in this browser');
  }
};
