'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
  href?: string;
};

export function Logo({
  className,
  imageClassName,
  textClassName,
  showText = true,
  href = '/',
}: LogoProps) {
  const content = (
    <div className={cn('flex items-center group', className)}>
      <div className={cn('relative h-10 w-10 shrink-0 transition-transform group-hover:scale-105', imageClassName)}>
        <Image
          src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png"
          alt="DropAI Logo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      {showText && (
        <span className={cn('text-xl font-semibold tracking-tight text-foreground', textClassName)}>
          DropAI
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
