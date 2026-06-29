import { Layout } from "./components/Layout";
import { Switch, Route, Redirect, Router as WouterRouter, useParams } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Dentrix from "@/pages/Dentrix";
import Security from "@/pages/Security";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Demo from "@/pages/Demo";
import Waitlist from "@/pages/Waitlist";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Resources from "@/pages/Resources";
import ResourcePost from "@/pages/ResourcePost";

const queryClient = new QueryClient();

function RedirectPost() {
  const { slug } = useParams<{ slug: string }>();
  return <Redirect to={`/resources/${slug}`} replace />;
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/features" component={Features} />
        <Route path="/dentrix" component={Dentrix} />
        <Route path="/security" component={Security} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/demo" component={Demo} />
        <Route path="/waitlist" component={Waitlist} />
        <Route path="/legal/privacy" component={Privacy} />
        <Route path="/legal/terms" component={Terms} />
        <Route path="/resources/:slug" component={ResourcePost} />
        <Route path="/resources" component={Resources} />

        {/* Legacy URL redirects (301-style client redirects) */}
        <Route path="/product"><Redirect to="/features" replace /></Route>
        <Route path="/book"><Redirect to="/demo" replace /></Route>
        <Route path="/blog/:slug" component={RedirectPost} />
        <Route path="/blog"><Redirect to="/resources" replace /></Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ssrPath is set only during build-time prerendering; in the browser it's
            undefined and wouter reads the location from the URL as usual. */}
        <WouterRouter ssrPath={ssrPath} base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
