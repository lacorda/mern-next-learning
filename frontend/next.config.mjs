/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `$antdModal: 'ant-modal-content'; $antdModalBody: 'ant-modal-body';`,
  },
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL
  }
};

export default nextConfig;
