import { Link, useParams } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { getPost, type Section } from "@/data/posts";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderSection(section: Section, idx: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2 key={idx} className="text-2xl font-bold text-[#0f172a] mt-12 mb-4">
          {section.content as string}
        </h2>
      );
    case "h3":
      return (
        <h3 key={idx} className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">
          {section.content as string}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-[#334155] leading-relaxed text-[1.0625rem] mb-5">
          {section.content as string}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="mb-5 space-y-2 pl-1">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex gap-3 text-[#334155] text-[1.0625rem] leading-relaxed">
              <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div key={idx} className="my-8 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] px-6 py-5">
          <p className="text-[#0f766e] leading-relaxed text-[1.0625rem] font-medium">
            {section.content as string}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? "");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useSEO(
    post
      ? {
          title: post.title,
          fullTitleOverride: `${post.title} | Mandi`,
          description: post.description,
          path: `/resources/${post.slug}`,
          type: "article",
          publishedAt: post.publishedAt,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: { "@type": "Organization", name: "Mandi", url: "https://heymandi.ai" },
            publisher: {
              "@type": "Organization",
              name: "Mandi",
              logo: { "@type": "ImageObject", url: "https://heymandi.ai/logo-primary.svg" },
            },
            image: "https://heymandi.ai/opengraph.png",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://heymandi.ai/resources/${post.slug}`,
            },
          },
        }
      : { title: "Post not found", description: "This post could not be found.", path: "/resources" }
  );

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Post not found</h1>
        <Link href="/resources" className="text-[#0d9488] hover:underline font-medium">
          Back to resources
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#0d9488] z-[100]" 
        style={{ scaleX, transformOrigin: "left" }} 
      />
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-border/40 pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            href="/resources"
            data-testid="link-back-to-resources"
            className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0d9488] mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            All posts
          </Link>
          <div className="flex items-center gap-3 mb-4 text-sm text-[#64748b]">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-[#64748b] leading-relaxed">{post.description}</p>
        </div>
      </div>

      {/* Body */}
      <article className="container mx-auto max-w-2xl px-4 pt-12">
        {post.body.map((section, idx) => renderSection(section, idx))}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0d9488] transition-colors"
          >
            <ArrowLeft size={15} />
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
