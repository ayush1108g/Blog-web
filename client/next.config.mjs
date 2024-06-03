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
  async headers() {
    return [
      {
        // matching all API routes
        source: "https://blog-web-4yaz.onrender.com/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
