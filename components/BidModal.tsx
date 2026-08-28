'use client';

import { useState } from 'react';
import { Spot, formatCurrency } from '@/lib/types';
import { calculateDeposit } from '@/lib/anti-snipe';

interface BidModalProps {
  spot: Spot;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BidModal({ spot, onClose, onSuccess }: BidModalProps) {
  const minBidDollars = spot.current_bid > 0
    ? (spot.current_bid / 100) + 5
    : spot.min_bid / 100;

  const [bidAmount, setBidAmount] = useState<number>(minBidDollars);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositDollars = calculateDeposit(bidAmount * 100, { deposit_pct: 0.20, min_deposit: 200 }) / 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (bidAmount < minBidDollars) {
      setError(`Minimum bid for this spot is $${minBidDollars}`);
      return;
    }

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
      formData.append('amount', Math.round(bidAmount * 100).toString());
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await fetch('/api/bid', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place bid');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-zinc-400 hover:text-black transition-colors text-xs"
        >
          [ESC]
        </button>

        {/* Spot Info Header */}
        <div className="mb-5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
            SPOT #{spot.id.toString().padStart(2, '0')} / {spot.tier} TIER
          </div>
          <h2 className="text-xl font-bold text-zinc-950 mt-0.5">{spot.label}</h2>
          
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-xs">
            <div>
              <div className="text-zinc-500">CURRENT BID</div>
              <div className="font-bold text-zinc-900">
                {spot.current_bid > 0 ? formatCurrency(spot.current_bid) : 'NONE'}
              </div>
            </div>
            <div>
              <div className="text-zinc-500">MIN. TO OUTBID</div>
              <div className="font-bold text-emerald-600">
                ${minBidDollars}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs font-mono text-rose-700">
            [ERROR] {error}
          </div>
        )}

        {/* Bid Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-zinc-600">TOTAL BID AMOUNT (USD)</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-zinc-400 font-mono">$</span>
              <input
                type="number"
                min={minBidDollars}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-7 pr-3 font-mono text-sm text-zinc-900 focus:border-black focus:outline-none shadow-sm"
                required
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] font-mono text-zinc-500">
              <span>20% DEPOSIT: <strong className="text-zinc-900">${depositDollars.toFixed(2)}</strong></span>
              <span>REFUNDED IF OUTBID</span>
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

          <div>
            <label className="block text-xs font-mono text-zinc-600">WEBSITE URL</label>
            <input
              type="url"
              placeholder="https://acme.ai"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-600">LOGO (PNG/SVG/JPG)</label>
            <div className="mt-1 flex items-center gap-2.5">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-zinc-500 file:mr-2.5 file:rounded file:border-0 file:bg-zinc-100 file:px-2.5 file:py-1 file:text-xs file:font-mono file:text-zinc-800 hover:file:bg-zinc-200 cursor-pointer"
              />
              {logoPreview && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 p-1">
                  <img src={logoPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-2.5 text-center text-xs font-bold font-mono text-white shadow-md hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'PROCESSING...' : `PROCEED TO PAY $${depositDollars.toFixed(2)} DEPOSIT >`}
            </button>
            <div className="mt-2 text-center text-[10px] font-mono text-zinc-400">
              Powered by Polar (MoR) / Direct Bank and Card Checkout
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
