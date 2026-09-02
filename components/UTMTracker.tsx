'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    let source = searchParams.get('utm_source');
    let medium = searchParams.get('utm_medium');
    const campaign = searchParams.get('utm_campaign');

    // Fallback: If no UTM source is in the URL, check where they came from (referrer)
    if (!source && typeof document !== 'undefined') {
      const ref = document.referrer.toLowerCase();
      if (ref.includes('twitter.com') || ref.includes('t.co') || ref.includes('x.com')) {
        source = 'twitter';
        medium = medium || 'social';
      } else if (ref.includes('reddit.com')) {
        source = 'reddit';
        medium = medium || 'social';
      } else if (ref.includes('linkedin.com')) {
        source = 'linkedin';
        medium = medium || 'social';
      } else if (ref.includes('news.ycombinator.com')) {
        source = 'hackernews';
        medium = medium || 'social';
      }
    }

    if (source) sessionStorage.setItem('utm_source', source);
    if (medium) sessionStorage.setItem('utm_medium', medium);
    if (campaign) sessionStorage.setItem('utm_campaign', campaign);
  }, [searchParams]);

  return null;
}
