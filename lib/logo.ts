/**
 * Automatically resolves a logo URL from a website domain or X/Twitter handle
 * without requiring the user to manually upload a file.
 */
export function getAutoLogoUrl(input: string): string | null {
  if (!input || !input.trim()) return null;

  const raw = input.trim();

  // 1. Check if it's an X / Twitter handle or URL
  // e.g. @mukundjha, x.com/mukundjha, twitter.com/mukundjha
  const twitterMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
  if (twitterMatch && twitterMatch[1]) {
    const handle = twitterMatch[1];
    return `https://unavatar.io/x/${handle}`;
  }

  if (raw.startsWith('@')) {
    const handle = raw.replace('@', '');
    return `https://unavatar.io/x/${handle}`;
  }

  // 2. Check if it's a GitHub URL or handle
  // e.g. github.com/mukundjha
  const githubMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch && githubMatch[1]) {
    return `https://unavatar.io/github/${githubMatch[1]}`;
  }

  // 3. Extract domain from website URL
  // e.g. https://linear.app/pricing -> linear.app
  let domain = raw;
  try {
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    const urlObj = new URL(domain);
    domain = urlObj.hostname.replace(/^www\./, '');
  } catch {
    domain = raw.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }

  if (domain && domain.includes('.')) {
    // Unavatar automatically queries high-res favicons, clearbit, and meta images with Google fallback
    return `https://unavatar.io/${domain}?fallback=https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  return null;
}
