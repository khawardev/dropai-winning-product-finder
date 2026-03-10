'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Zap,
  DollarSign,
  Users,
  Shield,
  Activity,
  Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-blue/30 overflow-x-hidden relative">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-cyan/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-1">
              <img src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" alt="DropAI Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold tracking-tight text-foreground">DropAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold transition-all">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
              DropAI 2.0 is now live — <span className="text-foreground hover:underline cursor-pointer">See what's new &rarr;</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-[1.1]">
              Find Winning Dropshipping <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan via-brand-blue to-brand-cyan">
                Products in Seconds
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop guessing. Use advanced AI trend analysis, profit estimation, and direct supplier matching to launch your next bestselling product.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_hsl(var(--primary)/0.6)] border border-primary/20">
                  Start 3-Day Free Trial
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Shield className="w-4 h-4" /> No credit card required to start
              </div>
            </div>

            {/* Micro Stats */}
            <div className="flex justify-center items-center gap-8 mt-12 text-muted-foreground">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-foreground mb-1">5M+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-brand-blue">Products Analysed</div>
              </div>
              <div className="w-px h-10 bg-accent" />
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-foreground mb-1">$100M+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-brand-cyan">Revenue Generated</div>
              </div>
              <div className="w-px h-10 bg-accent hidden sm:block" />
              <div className="hidden flex-col items-center sm:flex">
                <div className="text-2xl font-bold text-foreground mb-1">10k+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-brand-blue">Active Stores</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Video / App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative w-full mx-auto"
          >
            {/* Absolute Glow behind the video */}
            <div className="absolute -inset-1 bg-linear-to-r from-brand-blue to-brand-cyan rounded-2xl blur-3xl opacity-30 -z-10 animate-pulse" />
            
            <div className="relative rounded-2xl overflow-hidden border border-border bg-secondary shadow-2xl backdrop-blur-sm p-2 sm:p-4">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black">
                <video 
                  src="https://cdn.shopify.com/videos/c/o/v/12a7f831d44f4b548d0a6b45839f743d.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient overlay to smoothly merge into the background */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brands Banner */}
      <section className="py-12 border-y border-border bg-muted">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by successful founders selling on</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder SVGs for platforms - replacing real logos with stylized text for pure UI */}
            {['SHOPIFY', 'AMAZON', 'TIKTOK SHOP', 'WOOCOMMERCE', 'EBAY'].map((platform, i) => (
              <span key={i} className="text-xl font-bold font-sans tracking-tight text-foreground/70">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Split Feature Section 1 */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 text-primary text-sm font-semibold mb-6 border border-brand-cyan/20">
                <Search className="w-4 h-4" /> AI Research
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Spot the next viral <br /> trend <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-brand-blue">before it peaks</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our AI agents constantly monitor TikTok, Instagram, and major marketplaces. We analyze millions of data points to identify products that are just beginning to trend, giving you the first-mover advantage.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time social engagement tracking",
                  "Early-stage viral curve detection",
                  "Historical sales volume estimation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-primary/30">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20 rounded-3xl blur-2xl -z-10" />
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 flex items-center justify-center border border-primary/30">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Trend Analysis</h3>
                    <p className="text-sm text-muted-foreground">Live data processing</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[75, 92, 45].map((width, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Viral Probability</span>
                        <span className="text-foreground font-medium">{width}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Feature Section 2 (Reversed) */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-sm font-semibold mb-6 border border-brand-emerald/20">
                <DollarSign className="w-4 h-4" /> Profit Optimization
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Know your margins <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-emerald to-brand-blue">before spending a dime</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                DropAI instantly calculates your true margins. It accounts for product costs, estimated shipping rates, average CPA (Cost Per Acquisition), and transaction fees to reveal actual net profit.
              </p>
              <Link href="/signup">
                <Button className="bg-accent text-foreground hover:bg-accent/80 border border-border rounded-full px-6 transition-all">
                  Calculate Profits <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-linear-to-br from-brand-emerald/20 to-brand-blue/20 rounded-3xl blur-2xl -z-10" />
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Net Profit/Mo</p>
                    <div className="text-4xl font-bold flex items-center gap-2 text-foreground">
                      $12,450 <span className="text-sm font-semibold text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded-md">+24%</span>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-linear-to-br from-brand-emerald to-brand-blue flex items-center justify-center">
                    <DollarSign className="text-primary-foreground w-6 h-6" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Avg. CPA</p>
                    <p className="text-foreground font-semibold text-lg">$14.50</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Product Cost</p>
                    <p className="text-foreground font-semibold text-lg">$8.20</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Selling Price</p>
                    <p className="text-foreground font-semibold text-lg">$39.99</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Net Margin</p>
                    <p className="text-brand-emerald font-semibold text-lg">42%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground text-balance">The complete toolkit for modern dropshippers</h2>
            <p className="text-muted-foreground text-lg">Our AI handles the heavy lifting so you can focus on marketing and scaling.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Supplier Matcher",
                desc: "1-click matching to reliable suppliers with optimal shipping times via APIs.",
                icon: Globe2,
                gradient: "from-brand-blue/20 to-brand-blue/20",
                iconColor: "text-brand-blue"
              },
              {
                title: "Competitor Spy",
                desc: "Analyze other Shopify stores running the same product and estimate their daily revenue.",
                icon: Users,
                gradient: "from-brand-cyan/20 to-brand-cyan/20",
                iconColor: "text-brand-cyan"
              },
              {
                title: "AI Ad Copy",
                desc: "Auto-generate high-converting Facebook/TikTok ad scripts tailored to the product.",
                icon: TrendingUp,
                gradient: "from-brand-orange/20 to-brand-orange/20",
                iconColor: "text-brand-orange"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-muted border-border backdrop-blur-sm hover:bg-accent transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-8 px-8">
                  <div className={`size-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 border border-border`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-border relative">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-brand-cyan/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Scale without limits</h2>
            <p className="text-muted-foreground">Cancel anytime. Setup in 2 minutes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6 text-foreground">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["50 AI Searches/mo", "Basic Trend Tracking", "Email Support"].map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-secondary hover:bg-accent border border-border text-foreground">Start 3-Day Trial</Button>
              </CardContent>
            </Card>

            {/* Pro - Highlighted */}
            <Card className="bg-card border-primary/50 relative shadow-[0_0_30px_hsl(var(--primary)/0.15)] scale-105 z-10">
              <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                <span className="bg-linear-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-primary mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6 text-foreground">
                  <span className="text-5xl font-extrabold">$79</span>
                  <span className="text-muted-foreground font-medium">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Product Searches", 
                    "Advanced API Supplier Matching", 
                    "Competitor Ad Spy", 
                    "Priority 24/7 Support"
                  ].map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-lg shadow-primary/20">Start 3-Day Trial</Button>
              </CardContent>
            </Card>

            {/* Agency */}
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Agency</h3>
                <div className="flex items-baseline gap-1 mb-6 text-foreground">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Team Workspaces", "White-label Exports", "API Access", "Dedicated Success Manager"].map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-secondary hover:bg-accent text-foreground border border-border">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-border">
            <div className="col-span-2">
              <div className="flex items-center  mb-4">
                <img src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" alt="DropAI Logo" className="size-10 object-contain" />
                <span className="text-xl font-bold text-foreground">DropAI</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                The ultimate AI-powered product research tool for modern ecommerce brands.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2026 DropAI Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
               {/* Theme Toggle & Social icons */}
               <ThemeToggle />
               <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors cursor-pointer text-foreground">X</div>
               <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors cursor-pointer text-foreground">In</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
