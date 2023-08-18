import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import { formatBlogPosts } from "../scripts/utils"




export const get = (context) => {
  const postImportResult = import.meta.glob('./blog/**/*.md', { eager: true });
  const posts = formatBlogPosts(Object.values(postImportResult));

  return rss({
    title: 'My Astro Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
      description: post.frontmatter.description,
      customData: `
        <author>${post.frontmatter.author}</author>
      `,
      content: sanitizeHtml(post.compiledContent()),
      ...post.frontmatter
    }))
  })
};