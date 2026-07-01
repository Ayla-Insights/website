import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { allPms } from "@/data/pms";

const navLinks = [
  { href: "/features", label: "Features", testId: "link-features" },
  { href: "/security", label: "Security", testId: "link-security" },
  { href: "/pricing", label: "Pricing", testId: "link-pricing" },
  { href: "/resources", label: "Resources", testId: "link-resources" },
  { href: "/about", label: "About", testId: "link-about" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans overflow-x-clip">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium relative">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredPath(link.href)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "transition-colors relative py-1",
                    location === link.href ? "text-primary" : "text-foreground hover:text-primary"
                  )}
                  data-testid={link.testId}
                >
                  {link.label}
                </Link>
                <AnimatePresence>
                  {((hoveredPath === link.href) || (!hoveredPath && location === link.href)) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#0d9488] rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side: Free revenue report (primary funnel) + Book a demo + hamburger */}
          <div className="flex items-center gap-2">
            <Link href="/hidden-revenue" data-testid="link-revenue-report-nav" className="hidden md:block">
              <Button variant="default" className="bg-[#0d9488] hover:bg-[#0f766e] text-white">
                Find my hidden revenue →
              </Button>
            </Link>
            <Link href="/demo" data-testid="link-demo-nav">
              <Button variant="outline" className="border-[#0d9488] text-[#0d9488] hover:bg-[#f0fdfa]">
                Book a demo
              </Button>
            </Link>
            <button
              data-testid="button-mobile-menu-toggle"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted/60 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            data-testid="nav-mobile-menu"
            className="md:hidden border-t border-border/40 bg-background/98 px-4 py-4 flex flex-col gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`mobile-${link.testId}`}
                onClick={closeMenu}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted/60 hover:text-primary ${
                  location === link.href ? "text-primary bg-muted/40" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/40 mt-1 flex flex-col gap-1">
              <Link href="/hidden-revenue" data-testid="mobile-link-revenue-report" onClick={closeMenu}>
                <button className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0d9488] hover:bg-[#f0fdfa] transition-colors text-left">
                  Find my hidden revenue →
                </button>
              </Link>
              <Link href="/demo" data-testid="mobile-link-demo" onClick={closeMenu}>
                <button className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-primary transition-colors text-left">
                  Book a demo
                </button>
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                The AI copilot for the whole dental office. Find the revenue hiding in your practice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/hidden-revenue" className="hover:text-primary">Hidden Revenue Report</Link></li>
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/security" className="hover:text-primary">Security</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Integrations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {allPms.map((pms) => (
                  <li key={pms.slug}><Link href={`/${pms.slug}`} className="hover:text-primary">{pms.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/resources" className="hover:text-primary">Resources</Link></li>
                <li><a href="https://app.heymandi.ai" className="hover:text-primary">Beta Access</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><a href="mailto:hello@heymandi.ai" className="hover:text-primary">hello@heymandi.ai</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Mandi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
