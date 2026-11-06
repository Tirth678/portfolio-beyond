import { NextResponse } from 'next/server';
import { getFiles } from '@/lib/storage';

type RouteParams = {
  params: Promise<{ key: string[] }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const segments = (await params).key ?? [];
  const key = segments.join('/');

  // Only portfolio artwork is exposed, and never a traversing key.
  if (
    !key.startsWith('portfolio/') ||
    segments.some((segment) => segment === '..' || segment === '.')
  ) {
    return NextResponse.json({ error: 'Invalid image key' }, { status: 400 });
  }

  try {
    const file = await getFiles().download(key);
    const body = await file.arrayBuffer();

    return new Response(body, {
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'Content-Length': String(body.byteLength),
        'Cache-Control':
          'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Object storage read failed for', key, error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
