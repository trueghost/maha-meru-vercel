/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';  // Use import instead of require

const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Customize Terser options (remove console logs)
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Removes console.log in production
            },
          },
        }),
      ];
    }
    return config;
  },
};

export default nextConfig;