import { NextResponse } from 'next/server';
import { getAdjacentProjects, getProject } from '@/lib/data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { next, previous } = await getAdjacentProjects(slug);

  return NextResponse.json(
    { project, next: next?.slug ?? null, previous: previous?.slug ?? null },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
