/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "@tensorflow/tfjs-node": "commonjs @tensorflow/tfjs-node",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
