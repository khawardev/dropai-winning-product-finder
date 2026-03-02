'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Zap,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">DropAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              AI-Powered Product Research
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
              Find Winning Dropshipping <br /> Products with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Stop guessing. Use AI trend analysis, profit estimation, and supplier matching to launch your next bestseller in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-12 px-8 text-base">
                  Try Demo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted w-full sm:w-auto h-12 px-8 text-base">
                View Example
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20"></div>
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/9] w-full">
                <Image 
                  src="https://picsum.photos/seed/dashboard/1920/1080" 
                  alt="Dashboard Preview" 
                  fill
                  className="object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground">Our AI agents work 24/7 to find the most profitable opportunities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI Trend Detection",
                desc: "Real-time scanning of social media and marketplaces to spot viral products before they peak.",
                icon: TrendingUp,
                color: "text-primary"
              },
              {
                title: "Profit Estimator",
                desc: "Accurate margin calculations including shipping, COGS, and estimated ad spend.",
                icon: DollarSign,
                color: "text-emerald-500"
              },
              {
                title: "Supplier Matcher",
                desc: "Instantly find reliable suppliers with the best prices and fastest shipping times.",
                icon: Search,
                color: "text-secondary"
              },
              {
                title: "Competition Analyzer",
                desc: "See exactly how many stores are selling a product and their estimated daily sales.",
                icon: Users,
                color: "text-orange-500"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8">
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Choose the plan that fits your business stage.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "$29", features: ["50 AI Searches/mo", "Basic Trends", "Email Support"] },
              { name: "Pro", price: "$79", features: ["Unlimited Searches", "Advanced Analytics", "Supplier Database", "Priority Support"], popular: true },
              { name: "Agency", price: "$199", features: ["Multi-user Access", "White-label Reports", "API Access", "Dedicated Manager"] }
            ].map((plan, i) => (
              <Card key={i} className={`bg-card border-border relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="pt-10 pb-8 px-8">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alex R.", role: "Shopify Store Owner", text: "DropAI found me a product that did $10k in its first week. The trend analysis is spot on." },
              { name: "Sarah M.", role: "Ecommerce Agency", text: "We use this for all our clients. It saves us dozens of hours of manual research every month." },
              { name: "James K.", role: "Beginner Dropshipper", text: "The profit estimator is a game changer. I finally know my numbers before I spend a dime on ads." }
            ].map((t, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-muted-foreground italic mb-6">&quot;{t.text}&quot;</p>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold">DropAI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 DropAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
