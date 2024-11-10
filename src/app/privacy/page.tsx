import React from 'react'
import { Footer } from '@/components/local/footer'
import { Shield, Link2 } from 'lucide-react'
import Link from 'next/link'

const PrivacyPage = () => {
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
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Introduction</h2>
            <p className="text-muted-foreground">
              At ShortLinks, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your personal information when you use our URL shortening service.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
            <p className="text-muted-foreground">We collect the following types of information:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Account information (email, name) when you register</li>
              <li>URLs that you shorten using our service</li>
              <li>Analytics data about link clicks including:</li>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Click counts</li>
                <li>Geographic location data</li>
                <li>Browser and device information</li>
                <li>Timestamps of clicks</li>
              </ul>
            </ul>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
            <p className="text-muted-foreground">We use your information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Provide and maintain our URL shortening service</li>
              <li>Generate analytics and insights about your shortened links</li>
              <li>Improve and optimize our service</li>
              <li>Communicate with you about your account and service updates</li>
              <li>Prevent abuse and ensure security of our platform</li>
            </ul>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. This includes encryption, secure data storage, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your account information and shortened URLs for as long as your account is active. You can request deletion of your account and associated data at any time.
            </p>
          </section>

          <section className="rounded-lg border p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPage