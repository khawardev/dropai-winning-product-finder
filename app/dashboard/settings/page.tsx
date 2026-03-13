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
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

export default function SettingsPage() {
  return (
    <div className="mx-auto space-y-8 ">
      <div>
        <h1 className="text-2xl font-medium text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and subscription.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList >
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-medium text-primary">
                  AS
                </div>
                <div className="space-y-2">
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <Input defaultValue="Alex Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input defaultValue="alex@example.com" />
                </div>
              </div>

              <Button glow>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Switch />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card >
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="blue" shape="rounded">Current Plan</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Zap className="w-5 h-5 text-primary" /> Pro Plan
              </CardTitle>
              <CardDescription className="font-medium text-sm">You are currently on the Pro monthly plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-medium text-foreground tracking-tighter">$79</span>
                <span className="text-muted-foreground text-sm font-medium">/mo</span>
              </div>

              <div className="space-y-3">
                {['Unlimited AI Searches', 'Advanced Market Reports', 'Supplier Database Access', 'Priority 24/7 Support'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button>Upgrade Plan</Button>
                <Button variant="outline">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card >
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <Button variant="soft-text" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 ">
          <Card >
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Use these keys to integrate DropAI with your custom tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Public Key</label>
                <div className="flex gap-2">
                  <Input readOnly value="pk_live_51Mz..." />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Copy</Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Copy to clipboard</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Secret Key</label>
                <div className="flex gap-2">
                  <Input readOnly type="password" value="sk_live_82Kj..." />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Reveal</Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Show secret key</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Button variant="soft">Generate New Key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 ">
          <Card >
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
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground max-w-md">{item.desc}</p>
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
