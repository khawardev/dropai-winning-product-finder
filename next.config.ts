import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  turbopack: {
    root: '/Users/khawar/Downloads/dropai---winning-product-finder-2',
  },
  staticPageGenerationTimeout: 300,
}

export default nextConfig;
