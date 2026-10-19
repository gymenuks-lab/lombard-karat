/**
 * Публичные данные сайта в одном месте (header, footer).
 * Контакты отдаются только вне demo-режима (см. `contacts`).
 */
export const siteConfig = {
  name: '5 Карат',
  tagline: 'Ювелірний дім',
  logo: {
    src: '/images/logo-5karat-256.webp',
    alt: '5 Карат — ювелірний магазин золота та срібла',
  },
} as const

/**
 * DEMO MODE: публічна портфоліо-версія. Включений за замовчуванням.
 * Заявки не записуються в `orders`, у Telegram нічого не надсилається, реальні контакти не показуються.
 * Для бойового режиму задайте NEXT_PUBLIC_DEMO_MODE=false (змінна вбудовується при збірці).
 */
export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

export const DEMO_NOTICE = 'Демонстраційний проєкт. Товари та умови представлені для портфоліо.'

const realContacts = {
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

/** Контакти магазину; у demo-режимі null, щоб жоден компонент не показав реальні дані. */
export const contacts = demoMode ? null : realContacts

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
