import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { posts } from "@/data/posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  useSEO({
    title: "Blog",
    description:
      "Dental practice management insights from the Ayla team — unscheduled treatment, front office productivity, and HIPAA-ready software.",
    path: "/blog",
  });

  return (
    <div className="w-full pb-24">
      <section className="pt-24 pb-14 px-4 bg-[#f8fafc] border-b border-border/40 text-center">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Blog</h1>
          <p className="text-lg text-[#64748b]">
            Practice management insights from the Ayla team.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-testid={`link-post-${post.slug}`}
              className="group block bg-white border border-border/50 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-[#0d9488]/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3 text-sm text-[#64748b]">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#0d9488] transition-colors">
                {post.title}
              </h2>
              <p className="text-[#64748b] leading-relaxed text-sm">{post.description}</p>
              <span className="inline-block mt-4 text-sm font-medium text-[#0d9488]">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
