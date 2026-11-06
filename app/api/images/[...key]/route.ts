import { NextResponse } from 'next/server';
import { getFiles } from '@/lib/storage';

type RouteParams = {
  params: Promise<{ key: string[] }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const segments = (await params).key ?? [];
  const key = segments.join('/');

  // Only portfolio artwork is exposed, and never a traversing key.
  if (
    !key.startsWith('portfolio/') ||
    segments.some((segment) => segment === '..' || segment === '.')
  ) {
    return NextResponse.json({ error: 'Invalid image key' }, { status: 400 });
  }

  // The bundled seed artwork also works without Neon credentials.
  const bundledImages = new Set(['notes.jpg', 'philosophy.jpg', 'thoughts.jpg', 'shots.jpg', 'space.jpg']);
  if (!process.env.AWS_ACCESS_KEY_ID && segments.length === 2 && bundledImages.has(segments[1])) {
    return NextResponse.redirect(new URL(`/images/${segments[1]}`, request.url));
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
