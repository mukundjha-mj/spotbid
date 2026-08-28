import { NextResponse } from 'next/server';
import { getBids } from '@/lib/supabase';

export async function GET() {
  try {
    const bids = await getBids();
    return NextResponse.json({ bids });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch bids' }, { status: 500 });
  }
}
