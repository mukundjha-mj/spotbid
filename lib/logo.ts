/**
 * Automatically resolves a logo URL from a website domain or X/Twitter handle
 * without requiring the user to manually upload a file.
 *
 * Strategy:
 *  - X/Twitter handles & URLs → Microlink Direct Image Embed (reliable full-res avatar from pbs.twimg.com)
 *  - GitHub URLs → GitHub avatar API (128px, always works)
 *  - Domain/Website URLs → Google high-res favicon API (128px, extremely reliable)
 */

/** Extract a clean X/Twitter handle from various input formats */
function extractTwitterHandle(input: string): string | null {
  // Full URL: https://x.com/handle or https://twitter.com/handle
  const urlMatch = input.match(
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,20})/i
  );
  if (urlMatch?.[1]) return urlMatch[1];

  // @handle format
  if (input.startsWith('@')) {
    const handle = input.slice(1).trim();
    if (/^[a-zA-Z0-9_]{1,20}$/.test(handle)) return handle;
  }

  return null;
}

/** Extract a GitHub username from a URL */
function extractGithubUser(input: string): string | null {
  const match = input.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
  );
  return match?.[1] || null;
}

/** Extract a clean domain from a URL or bare domain string */
function extractDomain(input: string): string | null {
  let domain = input;
  try {
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    const urlObj = new URL(domain);
    domain = urlObj.hostname.replace(/^www\./, '');
  } catch {
    // Fallback: strip protocol and path manually
    domain = input.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }

  if (domain && domain.includes('.') && domain.length > 3) {
    return domain;
  }
  return null;
}

/**
 * Returns a logo URL for the given user input.
 * Tries multiple strategies to maximize the chance of returning a working image.
 */
export function getAutoLogoUrl(input: string): string | null {
  if (!input || !input.trim()) return null;

  const raw = input.trim();

  // 1. X / Twitter handle or URL (Direct High-Res Profile Avatar via Microlink)
  const twitterHandle = extractTwitterHandle(raw);
  if (twitterHandle) {
    return `https://api.microlink.io?url=${encodeURIComponent(`https://x.com/${twitterHandle}`)}&embed=image.url`;
  }

  // 2. GitHub URL
  const ghUser = extractGithubUser(raw);
  if (ghUser) {
    return `https://avatars.githubusercontent.com/${ghUser}?s=128`;
  }

  // 3. Domain / Website URL
  const domain = extractDomain(raw);
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  return null;
}

/**
 * Returns an array of fallback logo URLs to try in order.
 * Used by the BidModal to cascade through sources if the primary fails.
 */
export function getAutoLogoFallbacks(input: string): string[] {
  if (!input || !input.trim()) return [];

  const raw = input.trim();
  const urls: string[] = [];

  const twitterHandle = extractTwitterHandle(raw);
  if (twitterHandle) {
    urls.push(`https://api.microlink.io?url=${encodeURIComponent(`https://x.com/${twitterHandle}`)}&embed=image.url`);
    urls.push(`https://unavatar.io/twitter/${twitterHandle}`);
    urls.push(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(twitterHandle)}&background=10b981&color=fff&size=128&bold=true&format=png`
    );
    return urls;
  }

  const ghUser = extractGithubUser(raw);
  if (ghUser) {
    urls.push(`https://avatars.githubusercontent.com/${ghUser}?s=128`);
    urls.push(`https://unavatar.io/github/${ghUser}`);
    return urls;
  }

  const domain = extractDomain(raw);
  if (domain) {
    urls.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    urls.push(`https://logo.clearbit.com/${domain}`);
    urls.push(`https://api.microlink.io?url=${encodeURIComponent(`https://${domain}`)}&embed=image.url`);
    return urls;
  }

  return urls;
}
