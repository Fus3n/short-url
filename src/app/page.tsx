import { Button } from "@/components/ui/button"
import Link from "next/link";
import { ArrowRight, Link2, BarChart2, Shield, Zap } from "lucide-react";
import { Footer } from "@/components/local/footer";
import { getUserFromSession } from "@/lib/auth";

const features = [
  {
    icon: <Link2 className="h-6 w-6" />,
    title: "Custom Short Links",
    description: "Create memorable, branded links that reflect your identity"
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Detailed Analytics",
    description: "Track clicks, geographic data, and visitor insights in real-time"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Optimized infrastructure for quick redirects and minimal latency"
  }
];

export default async function Home() {
  // check if logged in 
  let isLoggedIn = (await getUserFromSession()) != null;
  console.log(isLoggedIn)

  return (
    <>
      <main className="flex min-h-screen flex-col">
        {/* Navbar */}
        <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    ShortLinks
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                {!isLoggedIn && <Button variant="ghost" asChild className="hover:bg-primary/10">
                  <Link href="/login" className="flex items-center gap-2">
                    Login
                  </Link>
                </Button>}
                <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Link href={`${isLoggedIn ? "/dashboard" : "/signup" }`}>
                    {isLoggedIn ? "Dashboard" : "Sign up for free"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 py-24 text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Short Links, <span className="text-primary">Powerful Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Transform your long URLs into powerful, trackable short links. Perfect for social media, marketing campaigns, and analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Link Shortener?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-background border">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example/Demo Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">See It in Action</h2>
            <div className="max-w-3xl mx-auto p-6 rounded-lg border bg-card">
              <p className="text-muted-foreground mb-4">Example shortened links:</p>
              <div className="space-y-3 text-left">
                <div className="p-3 rounded bg-muted">
                  <p className="text-sm font-mono">shortlinks.com/u/tech-conf</p>
                  <p className="text-xs text-muted-foreground">→ techconference2024.com/register?ref=social</p>
                </div>
                <div className="p-3 rounded bg-muted">
                  <p className="text-sm font-mono">shortlinks.com/u/summer-sale</p>
                  <p className="text-xs text-muted-foreground">→ mystore.com/summer-collection?campaign=social</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Create your first shortened link in seconds.</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
