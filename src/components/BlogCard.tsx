import Link from "next/link";
import Image from "next/image";
import { formatBlogDate, type BlogPost } from "@/data/blogs";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#f4e6ec]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-[#4a142a]">{post.category}</p>
      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[var(--foreground)] group-hover:text-[#4a142a]">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
      <p className="mt-auto pt-3 text-xs text-[var(--muted)]">{formatBlogDate(post.date)}</p>
    </Link>
  );
}
