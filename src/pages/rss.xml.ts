import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '~/lib/posts';
import { site } from '~/data/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${site.name} — Writing`,
    description:
      'Notes on systems, computer architecture, infrastructure and whatever I have recently been wrong about.',
    site: context.site!.toString(),
    items: posts
      .filter((post) => !post.data.draft)
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        // Externally published work has no page here, so point at the source.
        link: post.data.external ?? `/writing/${post.id}`,
        categories: post.data.tags,
      })),
    customData: '<language>en-gb</language>',
  });
}
