import { NextResponse } from 'next/server';
import { categoriesOf, getProjects } from '@/lib/data';

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get('category');
  const all = await getProjects();
  const projects =
    !category || category.toLowerCase() === 'all'
      ? all
      : all.filter(
          (project) => project.category.toLowerCase() === category.toLowerCase(),
        );

  return NextResponse.json(
    { count: projects.length, categories: categoriesOf(all), projects },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
