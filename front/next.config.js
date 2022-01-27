module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["images.prismic.io", "wallpapercave.com"],
  },
  async rewrites() {
    return [
      { 
        source: '/server1/:path*',
        destination: 'http://localhost:8005/:path*' // Proxy to Backend
      },
      { 
        source: '/server2/:path*',
        destination: 'http://localhost:8692/:path*' // Proxy to Backend
      }
    ]
  }
};
