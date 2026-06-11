import { Logo } from "@/components/Logo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/product" className="transition-colors hover:text-primary" data-testid="link-product">Product</Link>
            <Link href="/security" className="transition-colors hover:text-primary" data-testid="link-security">Security</Link>
            <Link href="/pricing" className="transition-colors hover:text-primary" data-testid="link-pricing">Pricing</Link>
            <Link href="/about" className="transition-colors hover:text-primary" data-testid="link-about">About</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/book" data-testid="link-book-nav">
              <Button variant="default" className="bg-[#0d9488] hover:bg-[#0f766e] text-white">Book a demo</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                AI copilot for dental front offices. Find the revenue hiding in your practice.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/product" className="hover:text-primary">Features</Link></li>
                <li><Link href="/security" className="hover:text-primary">Security</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><a href="mailto:hello@aylainsights.com" className="hover:text-primary">hello@aylainsights.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ayla Insights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
