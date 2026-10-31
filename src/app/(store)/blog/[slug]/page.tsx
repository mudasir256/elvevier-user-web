import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogs, formatBlogDate, getBlog, readingMinutes } from "@/data/blogs";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return { title: "Blog" };
  const title = post.seoTitle ?? post.title;
  const meta = pageMeta({ title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.image });
  return {
    ...meta,
    keywords: post.keywords,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      section: post.category,
      tags: post.keywords,
    },
  };
}

// Turns [label](/path) in blog text into internal links; everything else stays plain text.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return link ? (
          <Link key={index} href={link[2]} className="font-medium text-[#4a142a] underline underline-offset-4 hover:text-[#350e1e]">
            {link[1]}
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();
  const more = blogs.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <JsonLd data={articleJsonLd(post)} />
      {post.faq?.length ? <JsonLd data={faqJsonLd(post.faq)} /> : null}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blogs", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <p className="text-sm text-[var(--muted)]">
        <Link href="/blog" className="hover:text-[#4a142a]">
          Blogs
        </Link>
        <span className="mx-2">/</span>
        <span>{post.category}</span>
      </p>
      <h1 className="section-heading mt-4">{post.title}</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time> · {readingMinutes(post)} min read
      </p>
      <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[#f4e6ec] sm:aspect-[5/4]">
        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
      </div>

      <div className="type-copy mt-8 space-y-5 text-[var(--foreground)]">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <Rich text={paragraph} />
          </p>
        ))}
      </div>

      {post.sections?.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="section-heading text-[var(--foreground)]">{section.heading}</h2>
          <div className="type-copy mt-4 space-y-4 text-[var(--foreground)]">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>
                <Rich text={paragraph} />
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="list-disc space-y-2 pl-5 marker:text-[#c989a3]">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Rich text={bullet} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}

      {post.faq?.length ? (
        <section className="mt-12 rounded-[1.6rem] bg-[#faf8f5] p-6 sm:p-8">
          <h2 className="section-heading text-[var(--foreground)]">Frequently asked questions</h2>
          <dl className="mt-5 space-y-5">
            {post.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-[#4a142a]">{item.q}</dt>
                <dd className="type-copy mt-1.5 text-[var(--muted)]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {post.shop?.length ? (
        <section className="mt-10">
          <h2 className="eyebrow">Shop this guide</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.shop.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[#4a142a] transition hover:border-[#4a142a] hover:bg-[#f4e6ec]"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {more.length > 0 && (
        <div className="mt-14 border-t border-[var(--border)] pt-8">
          <h2 className="section-heading">More from the journal</h2>
          <ul className="mt-4 space-y-3">
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/${item.slug}`} className="text-[#4a142a] hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
