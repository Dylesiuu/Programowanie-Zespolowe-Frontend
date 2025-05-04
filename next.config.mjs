/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'schronisko.org.pl',
        port: '',
        pathname: '/**', // Allows all paths
      },
      // Add more patterns if needed:
      {
        protocol: 'https',
        hostname: '**.schronisko.org.pl', // All subdomains
      },
    ],
  },
};

export default nextConfig;
