/**
 * Публичные данные сайта в одном месте (header, footer).
 * Значения перенесены из существующего кода без изменений.
 * Для публичной портфолио-версии их можно заменить здесь, не трогая компоненты.
 */
export const siteConfig = {
  name: '5 Карат',
  tagline: 'Ювелірний дім',
  logo: {
    src: '/images/logo-5karat-256.webp',
    alt: '5 Карат — ювелірний магазин золота та срібла',
  },
  phone: {
    display: '+380 93 820 54 48',
    href: 'tel:+380938205448',
  },
  telegram: {
    handle: '@k5karat',
    href: 'https://t.me/k5karat',
  },
  address: 'м. Одеса, вул. Пантелеймонівська, 122',
  hours: 'Щодня 08:00 — 19:00',
} as const

export type NavItem = {
  label: string
  href: string
  /** Значение ?category= для активного состояния; null — обычная ссылка */
  category?: 'lombard' | 'manufacturer' | 'all'
}

export const mainNav: readonly NavItem[] = [
  { label: 'Каталог', href: '/catalog', category: 'all' },
  { label: 'Вживані', href: '/catalog?category=lombard', category: 'lombard' },
  { label: 'Від виробника', href: '/catalog?category=manufacturer', category: 'manufacturer' },
  { label: 'Контакти', href: '/#contacts' },
]
