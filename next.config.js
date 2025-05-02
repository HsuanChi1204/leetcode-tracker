/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/leetcode-tracker',
  assetPrefix: '/leetcode-tracker/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 