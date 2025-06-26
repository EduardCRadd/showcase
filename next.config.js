/** @type {import('next').NextConfig} */

const dotenv = require('dotenv')
const path = require('path')

const envFile = `.env.${process.env.IOTT_NODE_ENV || 'prd'}`
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

const nextConfig = {
  reactStrictMode: false,

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    BASE_PATH: process.env.BASE_PATH,
  },
  basePath: process.env.BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'madri-2024.s3.eu-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'se-stg-madri-excepcional-conectada.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'se-prd-madri-excepcional-conectada.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'sharpend-1325-madri-conectada-2024.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/rewards',
        destination: '/',
        permanent: true,
      },
      {
        source: '/rewards/claim',
        destination: '/',
        permanent: true,
      },
      {
        source: '/madrid-trip',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    })

    return config
  },
}

module.exports = nextConfig
