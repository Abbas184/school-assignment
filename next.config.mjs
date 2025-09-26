/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        // IMPORTANT: Replace 'dpgvmbhzi' with YOUR Cloudinary Cloud Name
        pathname: '/dpgvmbhzi/image/upload/**', 
      },
    ],
  },
};

export default nextConfig;