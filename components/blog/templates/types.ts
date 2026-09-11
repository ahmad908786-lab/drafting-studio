import type { PostCard } from "@/components/shared/post-card";

export type PostForTemplate = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMdx: string;
  coverImage: string | null;
  readMinutes: number;
  publishedAt: Date | null;
  template: string;
  meta: unknown;
  category: { name: string; slug: string; color: string } | null;
  author: { name: string | null; image: string | null; title: string | null } | null;
  tags: { slug: string; name: string }[];
};

export type TocItem = { id: string; text: string; level: number };
export type RelatedPost = React.ComponentProps<typeof PostCard>["post"];

export type TemplateProps = {
  post: PostForTemplate;
  toc: TocItem[];
  related: RelatedPost[];
};
