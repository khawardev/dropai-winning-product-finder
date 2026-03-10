'use client';

import React from 'react';
import {
  User,
  Key,
  CreditCard,
  Bell,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  Globe,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

export default function SettingsPage() {
  return (
    <div className="mx-auto space-y-8 ">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and subscription.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className=" bg-muted/50 border border-border p-1 w-full justify-start h-12">
          <TabsTrigger value="profile" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profile</TabsTrigger>
          <TabsTrigger value="subscription" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Subscription</TabsTrigger>
          <TabsTrigger value="api" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6 ">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  AS
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="border-border text-foreground">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <Input defaultValue="Alex Smith" className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input defaultValue="alex@example.com" className="bg-muted/50 border-border" />
                </div>
              </div>

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Switch />
              </div>
              <Button variant="outline" className="border-border text-foreground">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6 space-y-6 ">
          <Card className="bg-card border-border border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Current Plan</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Pro Plan
              </CardTitle>
              <CardDescription>You are currently on the Pro monthly plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$79</span>
                <span className="text-muted-foreground">/mo</span>
              </div>

              <div className="space-y-3">
                {['Unlimited AI Searches', 'Advanced Market Reports', 'Supplier Database Access', 'Priority 24/7 Support'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Upgrade Plan</Button>
                <Button variant="outline" className="border-border text-foreground">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6 ">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Use these keys to integrate DropAI with your custom tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Public Key</label>
                <div className="flex gap-2">
                  <Input readOnly value="pk_live_51Mz..." className="bg-muted/50 border-border font-mono text-xs" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="border-border text-foreground">Copy</Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Copy to clipboard</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Secret Key</label>
                <div className="flex gap-2">
                  <Input readOnly type="password" value="sk_live_82Kj..." className="bg-muted/50 border-border font-mono text-xs" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="border-border text-foreground">Reveal</Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Show secret key</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Generate New Key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6 ">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New Winning Products', desc: 'Get notified when our AI finds a high-potential product in your niche.' },
                { label: 'Market Reports', desc: 'Weekly summary of market trends and category performance.' },
                { label: 'Security Alerts', desc: 'Important updates about your account security and login activity.' },
                { label: 'Product Updates', desc: 'New features and improvements to the DropAI platform.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground max-w-md">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
