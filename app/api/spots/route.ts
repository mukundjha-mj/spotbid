import { NextResponse } from 'next/server';
import { getSpots } from '@/lib/supabase';

export async function GET() {
  try {
    const spots = await getSpots();
    return NextResponse.json({ spots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch spots' }, { status: 500 });
  }
}
