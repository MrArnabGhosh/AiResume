import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions:{
      bodySizeLimit:"4mb",
    },
  },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"liAvADWfhOv45Fe7.public.blob.vercel.storage.com",
      },
    ]
  }
};

export default nextConfig;
