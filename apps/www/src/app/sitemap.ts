import { MetadataRoute } from "next";
import { allPosts } from "content-collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = "dingify.io"; // Replace with your actual domain

  // Manually added static pages with today's date
  const staticPagesSitemap = [
    {
      url: `https://${domain}/`, // Home page
      lastModified: new Date("2023-11-28"), // Set to November 28, 2023
    },
    {
      url: `https://${domain}/pricing`, // Pricing page
      lastModified: new Date("2023-11-28"), // Set to November 28, 2023
    },
    // Add other static pages here if necessary
  ];

  // // Sitemap for dynamic pages
  // const pagesSitemap = allPages.map((page) => ({
  //   url: `https://${domain}/${page.slug.replace(/^\/+/g, "")}`, // Remove leading
  //   // lastModified can be included if available
  // }));

  // Sitemap for blog posts
  const postsSitemap = allPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: `https://${domain}/${post.slug.replace(/^\/+/g, "")}`, // Correct path and remove leading slashes
      lastModified: new Date(post.date),
    }));

  // Combine sitemaps
  return [...staticPagesSitemap, ...postsSitemap];
}
