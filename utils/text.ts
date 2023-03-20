export function generateRandomString(numChars: number): string {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < numChars; i++) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return randomString;
}

export const truncate = (text: string, l = 30) => {
  return text.length <= l ? text : text.substring(0, l) + '...';
};

export const urlRegex = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/i;
export const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/i;

export const isValidUrl = (urlString: string) => {
  return !!urlRegex.test(urlString);
};

export const copyToClipBoard = (text: string) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const capitalize = (string?: string) => {
  if (!string) return string;
  return string[0].toUpperCase() + string.slice(1);
};
