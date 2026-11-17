import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Profiles live at /@username; folders starting with "@" are parallel-route
  // slots in the App Router, so the real route is /u/[username].
  async rewrites() {
    return [{ source: "/@:username", destination: "/u/:username" }];
  },
  async redirects() {
    return [
      { source: "/post", destination: "/write", permanent: true },
      { source: "/profile/:username", destination: "/@:username", permanent: true },
      { source: "/profile/:username/posts", destination: "/@:username", permanent: true },
      { source: "/profile/:username/liked", destination: "/@:username?tab=likes", permanent: true },
      { source: "/profile/:username/guidelines", destination: "/guidelines", permanent: true },
    ];
  },
};

export default nextConfig;
