/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    // DEMO MODE включён по умолчанию. Значение фиксируется при сборке, поэтому бандлер
    // вырезает реальные контакты из клиентского JS, пока не задано NEXT_PUBLIC_DEMO_MODE=false.
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE === 'false' ? 'false' : 'true',
  },
}

export default nextConfig
