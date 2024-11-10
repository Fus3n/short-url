import React from 'react'
import { Footer } from '@/components/local/footer'
import { ScrollText, Link2 } from 'lucide-react'
import Link from 'next/link'

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Link2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ShortLinks
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ScrollText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Terms of Service</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using ShortLinks, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Service Description</h2>
            <p className="text-muted-foreground">
              ShortLinks provides URL shortening services that allow users to create shortened versions of long URLs. We also provide analytics and tracking features for these shortened links.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">User Responsibilities</h2>
            <p className="text-muted-foreground">You agree not to use our service to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Share malicious or harmful content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute spam or unwanted content</li>
              <li>Attempt to bypass our security measures</li>
            </ul>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Service Availability</h2>
            <p className="text-muted-foreground">
              While we strive to maintain high availability, we do not guarantee uninterrupted access to our service. We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content and materials available on ShortLinks, including but not limited to text, graphics, logos, and software, are the property of ShortLinks or its licensors and are protected by intellectual property laws.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              ShortLinks shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TermsPage