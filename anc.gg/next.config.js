/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // ⚠️ suppress TS errors (use with caution)
      },
    eslint: {
        ignoreDuringBuilds: true, // ✅ skips ESLint during `next build`
    },
    output: 'export', // ✅ enables static HTML export (replaces `next export`)
};

module.exports = nextConfig;
