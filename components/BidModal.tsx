'use client';

import { useState, useEffect, useRef } from 'react';
import { Spot, formatCurrency } from '@/lib/types';
import { getAutoLogoUrl, getAutoLogoFallbacks } from '@/lib/logo';
import { getNextSpotPriceDollars } from '@/lib/pricing';

interface BidModalProps {
  spot: Spot;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BidModal({ spot, onClose, onSuccess }: BidModalProps) {
  const requiredPriceDollars = getNextSpotPriceDollars(spot);
  const isTaken = spot.current_bid > 0;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [autoLogo, setAutoLogo] = useState<string | null>(null);
  const [logoFallbacks, setLogoFallbacks] = useState<string[]>([]);
  const fallbackIndexRef = useRef(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Auto-detect logo as user types URL or brand/handle
  useEffect(() => {
    fallbackIndexRef.current = 0;
    if (url.trim()) {
      setAutoLogo(getAutoLogoUrl(url));
      setLogoFallbacks(getAutoLogoFallbacks(url));
    } else if (name.trim() && (name.includes('.') || name.startsWith('@'))) {
      setAutoLogo(getAutoLogoUrl(name));
      setLogoFallbacks(getAutoLogoFallbacks(name));
    } else {
      setAutoLogo(null);
      setLogoFallbacks([]);
    }
  }, [url, name]);

  // When the logo image fails to load, try the next fallback
  const handleLogoError = () => {
    fallbackIndexRef.current += 1;
    if (fallbackIndexRef.current < logoFallbacks.length) {
      setAutoLogo(logoFallbacks[fallbackIndexRef.current]);
    } else {
      setAutoLogo(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeLogoUrl = customPreview || autoLogo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your brand or project name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('spot_id', spot.id.toString());
      formData.append('bidder_name', name);
      formData.append('bidder_email', email);
      formData.append('bidder_url', url);
      formData.append('amount', Math.round(requiredPriceDollars * 100).toString());
      
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (autoLogo) {
        formData.append('auto_logo_url', autoLogo);
      }

      const utmSource = sessionStorage.getItem('utm_source');
      const utmMedium = sessionStorage.getItem('utm_medium');
      const utmCampaign = sessionStorage.getItem('utm_campaign');

      if (utmSource) formData.append('utm_source', utmSource);
      if (utmMedium) formData.append('utm_medium', utmMedium);
      if (utmCampaign) formData.append('utm_campaign', utmCampaign);

      const res = await fetch('/api/bid', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout is temporarily unavailable. Please try again.');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cleanLabel = spot.label.replace(/—|–/g, '/');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-pointer animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl text-left cursor-default animate-scaleUp"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-zinc-400 hover:text-black transition-colors text-xs cursor-pointer"
        >
          [ESC]
        </button>

        {/* Spot Info Header */}
        <div className="mb-5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
            SPOT #{spot.id.toString().padStart(2, '0')} / {spot.tier} TIER
          </div>
          <h2 className="text-xl font-bold text-zinc-950 mt-0.5">{cleanLabel}</h2>
          
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-xs">
            <div>
              <div className="text-zinc-500">CURRENT OWNER</div>
              <div className="font-bold text-zinc-900 truncate">
                {isTaken ? `${spot.bidder_name} (${formatCurrency(spot.current_bid)})` : 'NONE (OPEN)'}
              </div>
            </div>
            <div>
              <div className="text-zinc-500">
                {isTaken ? '+70% TAKEOVER' : 'FIXED PRICE'}
              </div>
              <div className="font-bold text-emerald-600">
                ${requiredPriceDollars} USD
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Bid Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Locked Fixed Price Display */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                {isTaken ? 'Spot Takeover Fee (+70%)' : 'Initial Placement Fee'}
              </div>
              <div className="text-xl font-mono font-extrabold text-zinc-950">
                ${requiredPriceDollars} <span className="text-xs font-normal text-zinc-500">USD</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                isTaken ? 'bg-rose-100 text-rose-800' : 'bg-zinc-200/80 text-zinc-800'
              }`}>
                {isTaken ? '+70% TAKEOVER' : 'LOCKED FIXED PRICE'}
              </span>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">Non-refundable</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-mono text-zinc-600">BRAND NAME</label>
              <input
                type="text"
                placeholder="Acme AI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-600">EMAIL</label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none shadow-sm"
                required
              />
            </div>
          </div>

          {/* Website / X Profile (Auto-Logo Source) */}
          <div>
            <label className="block text-xs font-mono text-zinc-600">
              WEBSITE OR X (TWITTER) HANDLE
            </label>
            <input
              type="text"
              placeholder="e.g. acme.ai or @acme or x.com/acme"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none shadow-sm"
            />
          </div>

          {/* Live Auto-Fetched Logo Preview */}
          {activeLogoUrl ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-300 bg-white p-1 shadow-xs">
                  <img
                    src={activeLogoUrl}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain rounded"
                    onError={handleLogoError}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <span>✓</span> Logo Auto-Fetched
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 truncate">
                    Ready to place on the board
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowManualUpload(!showManualUpload)}
                className="text-[11px] font-mono text-emerald-800 underline shrink-0 hover:text-emerald-950 ml-2 cursor-pointer"
              >
                {showManualUpload ? 'Keep auto' : 'Upload custom'}
              </button>
            </div>
          ) : (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowManualUpload(!showManualUpload)}
                className="text-[11px] font-mono text-zinc-500 underline hover:text-black cursor-pointer"
              >
                {showManualUpload ? 'Hide file upload' : '+ Upload logo manually (optional)'}
              </button>
            </div>
          )}

          {/* Optional Manual File Upload */}
          {showManualUpload && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
              <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                UPLOAD CUSTOM LOGO (PNG/SVG/JPG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-zinc-500 file:mr-2.5 file:rounded file:border-0 file:bg-white file:border-zinc-200 file:px-2.5 file:py-1 file:text-xs file:font-mono file:text-zinc-800 hover:file:bg-zinc-100 cursor-pointer"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-2.5 text-center text-xs font-bold font-mono text-white shadow-md transition-all disabled:opacity-50 active:scale-95 cursor-pointer ${
                isTaken ? 'bg-rose-600 hover:bg-rose-500' : 'bg-black hover:bg-zinc-800'
              }`}
            >
              {loading
                ? 'PROCESSING...'
                : isTaken
                ? `TAKE OVER SPOT FOR $${requiredPriceDollars} >`
                : `PROCEED TO PAY $${requiredPriceDollars} >`}
            </button>
            <div className="mt-2 text-center text-[10px] font-mono text-zinc-400">
              Fixed · Non-refundable · Direct Card and Apple Pay Checkout
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
