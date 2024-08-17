import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { rehypeCode, remarkGfm } from "fumadocs-core/mdx-plugins";

const Doc = defineCollection({
  name: "Doc",
  directory: "src/content/docs",
  include: ["**/*.mdx", "*.mdx"],
  schema: (z) => ({
    title: z.string({ required_error: "Title is required" }),
    description: z.string(),
    published: z.boolean().default(true),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode]],
    });
    return {
      ...document,
      body,
      _id: document._meta.filePath,
      slug: document._meta.path,
      slugAsParams: document._meta.path.split("/").slice(1).join("/"),
    };
  },
});

const Guide = defineCollection({
  name: "Guide",
  directory: "src/content/guides",
  include: ["**/*.mdx", "*.mdx"],
  schema: (z) => ({
    title: z.string({ required_error: "title is required" }),
    description: z.string(),
    date: z.coerce.date({ required_error: "date is required" }),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode]],
    });
    return {
      ...document,
      body,
      _id: document._meta.filePath,
      slug: document._meta.path,
      slugAsParams: document._meta.path.split("/").slice(1).join("/"),
    };
  },
});

const Post = defineCollection({
  name: "Post",
  directory: "src/content/blog",
  include: ["**/*.mdx", "*.mdx"],
  schema: (z) => ({
    title: z.string({ required_error: "title is required" }),
    description: z.string(),
    date: z.coerce.date({ required_error: "date is required" }),
    published: z.boolean().default(true),
    image: z.string({ required_error: "Image is required"}),
    authors: z.array(z.string(), { required_error: "author is required" }),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode]],
    });
    return {
      ...document,
      body,
      _id: document._meta.filePath,
      slug: document._meta.path,
      slugAsParams: document._meta.path.split("/").slice(1).join("/"),
    };
  },
});

const Author = defineCollection({
  name: "Author",
  directory: "src/content/authors",
  include: ["**/*.mdx", "*.mdx"],
  schema: (z) => ({
    title: z.string({ required_error: "title is required" }),
    description: z.union([z.string(), z.undefined()]),
    avatar: z.string({ required_error: "avatar is required" }),
    twitter: z.string({ required_error: "twitter is required" }),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode]],
    });
    return {
      ...document,
      body,
      _id: document._meta.filePath,
      slug: document._meta.path,
      slugAsParams: document._meta.path.split("/").slice(1).join("/"),
    };
  },
});

const Page = defineCollection({
  name: "Page",
  directory: "src/content/pages",
  include: ["**/*.mdx", "*.mdx"],
  schema: (z) => ({
    title: z.string({ required_error: "title is required" }),
    description: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode]],
    });
    return {
      ...document,
      body,
      _id: document._meta.filePath,
      slug: document._meta.path,
      slugAsParams: document._meta.path.split("/").slice(1).join("/"),
    };
  },
});

export default defineConfig({
  collections: [Doc, Guide, Author, Post, Page],
});
