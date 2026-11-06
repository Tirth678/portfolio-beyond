import { NextResponse } from 'next/server';
import { getPortfolio } from '@/lib/data';

export async function GET() {
  const portfolio = await getPortfolio();

  return NextResponse.json(portfolio, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
