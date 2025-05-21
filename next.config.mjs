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
      {
        protocol: 'https',
        hostname: 'schronisko-torun.oinfo.pl', // HTTPS for this hostname
        pathname: '/**',
      },
      {
        protocol: 'http', // Add HTTP for this hostname
        hostname: 'schronisko-torun.oinfo.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pettownsendvet.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
