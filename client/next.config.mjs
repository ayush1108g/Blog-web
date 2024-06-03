/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "cdn.example" },
      { hostname: "drive.google.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "blog-web-4yaz.onrender.com" },
      { hostname: "blog-web-4yaz.onrender.com/api/fileupload" },
    ],
  },
};

export default nextConfig;
