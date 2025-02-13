/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    additionalData: `$antdModal: 'ant-modal-content'; $antdModalBody: 'ant-modal-body';`,
  },
  // 废弃，移到.env
  // publicRuntimeConfig: {
  //   API_BASE_URL: process.env.API_BASE_URL
  // }
};

module.exports = nextConfig;
