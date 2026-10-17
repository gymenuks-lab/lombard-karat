import type { Metadata } from "next"
import { Gem } from "lucide-react"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Internal visual QA page: never indexed, never linked from site navigation.
export const metadata: Metadata = {
  title: "Design system — 5 Карат",
  robots: { index: false, follow: false, nocache: true },
}

interface Swatch {
  token: string
  hex: string
  role: string
  swatch: string
  label: string
}

const PALETTE: { group: string; items: Swatch[] }[] = [
  {
    group: "Ivory — поверхні",
    items: [
      { token: "ivory-50", hex: "#FBF9F4", role: "Фон сторінки", swatch: "bg-ivory-50", label: "text-ink-900" },
      { token: "ivory-100", hex: "#F4EFE6", role: "Чергові секції, muted", swatch: "bg-ivory-100", label: "text-ink-900" },
      { token: "ivory-200", hex: "#EBE4D6", role: "Підкладка під фото", swatch: "bg-ivory-200", label: "text-ink-900" },
      { token: "paper", hex: "#FFFDF9", role: "Картки, popover", swatch: "bg-paper", label: "text-ink-900" },
      { token: "line", hex: "#E2DACB", role: "Тонкі роздільники", swatch: "bg-line", label: "text-ink-900" },
      { token: "line-strong", hex: "#CBC1AE", role: "Рамка полів", swatch: "bg-line-strong", label: "text-ink-900" },
    ],
  },
  {
    group: "Ink — текст і темні поверхні",
    items: [
      { token: "ink-950", hex: "#100F0D", role: "Затемнення поверх фото", swatch: "bg-ink-950", label: "text-ivory-50" },
      { token: "ink-900", hex: "#1A1816", role: "Текст, primary, темні секції", swatch: "bg-ink-900", label: "text-ivory-50" },
      { token: "ink-800", hex: "#262320", role: "Темні поверхні", swatch: "bg-ink-800", label: "text-ivory-50" },
      { token: "ink-600", hex: "#57524A", role: "Другорядний текст", swatch: "bg-ink-600", label: "text-ivory-50" },
      { token: "ink-500", hex: "#6B665A", role: "Приглушений текст", swatch: "bg-ink-500", label: "text-ivory-50" },
      { token: "ink-300", hex: "#A8A397", role: "Приглушений текст на темному", swatch: "bg-ink-300", label: "text-ink-900" },
    ],
  },
  {
    group: "Champagne gold — лише акцент",
    items: [
      { token: "gold-300", hex: "#D8C29A", role: "Золото на темному", swatch: "bg-gold-300", label: "text-ink-900" },
      { token: "gold-500", hex: "#BFA270", role: "Лінії та декор (не текст на світлому)", swatch: "bg-gold-500", label: "text-ink-900" },
      { token: "gold-700", hex: "#7E6330", role: "Рідкісний золотий текст на світлому", swatch: "bg-gold-700", label: "text-ivory-50" },
      { token: "error", hex: "#A5342A", role: "Помилки", swatch: "bg-error", label: "text-ivory-50" },
    ],
  },
]

// Contrast ratios were calculated with the WCAG 2.x relative luminance formula.
const CONTRAST: { pair: string; ratio: string; verdict: string }[] = [
  { pair: "ink-900 на ivory-50", ratio: "16.8 : 1", verdict: "Основний текст" },
  { pair: "ink-600 на ivory-50", ratio: "7.4 : 1", verdict: "Другорядний текст" },
  { pair: "ink-500 на ivory-50 / 100 / 200", ratio: "5.4 / 5.0 / 4.5 : 1", verdict: "Підписи — AA на всіх ivory" },
  { pair: "ivory-50 на ink-900", ratio: "16.8 : 1", verdict: "Текст кнопки primary" },
  { pair: "gold-300 на ink-900", ratio: "10.2 : 1", verdict: "Золото на темному" },
  { pair: "gold-700 на ivory-50", ratio: "5.4 : 1", verdict: "Золотий текст на світлому" },
  { pair: "gold-500 на ivory-50", ratio: "2.3 : 1", verdict: "Не використовувати як текст" },
]

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="section-y border-t border-border first:border-t-0">
      <div className="container-site">
        <div className="mb-10 max-w-2xl">
          <p className="type-eyebrow">{id}</p>
          <h2 className="type-h2 mt-3">{title}</h2>
          {note && <p className="type-body mt-3 text-muted-foreground">{note}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-border py-5 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-8">
      <p className="type-caption text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

const SAMPLE_BASE: Product = {
  id: "design-system-example",
  title: "Назва виробу (умовний приклад)",
  description: "",
  price: 12500,
  currency: "UAH",
  category: "manufacturer",
  metal: "Метал",
  sample: "000",
  weight: 0,
  item_type: null,
  images: [],
  telegram_message_id: null,
  telegram_post_url: null,
  status: "available",
  is_published: true,
  created_at: "",
  updated_at: "",
}

// Умовні дані лише для перевірки станів компонента. Це не реальні товари.
const SAMPLE_PRODUCTS: Product[] = [
  { ...SAMPLE_BASE, id: "design-system-example-1", weight: 2.5 },
  { ...SAMPLE_BASE, id: "design-system-example-2", category: "lombard", metal: null, sample: null, weight: null },
  { ...SAMPLE_BASE, id: "design-system-example-3", status: "reserved" },
  { ...SAMPLE_BASE, id: "design-system-example-4", status: "sold", price: null },
]

export default function DesignSystemPage() {
  return (
    <main className="bg-background text-foreground">
      <header className="section-y pb-0!">
        <div className="container-site">
          <p className="type-eyebrow">Internal · visual QA</p>
          <h1 className="type-h1 mt-3">
            Design system <em className="italic">5 Карат</em>
          </h1>
          <p className="type-body-lg mt-4 max-w-2xl text-muted-foreground">
            Живий референс токенів і компонентів проєкту. Сторінка не індексується й не входить до навігації. Усі зразки
            нижче рендеряться реальними токенами з <code className="type-caption">app/globals.css</code> та реальними
            компонентами з <code className="type-caption">components/ui</code>.
          </p>
          <nav aria-label="Розділи" className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {["palette", "typography", "foundations", "buttons", "links", "forms", "tabs", "dialog", "surfaces", "focus", "product-card"].map(
              (id) => (
                <a key={id} href={`#${id}`} className="type-nav link-nav text-muted-foreground hover:text-foreground">
                  {id}
                </a>
              ),
            )}
          </nav>
        </div>
      </header>

      <Section id="palette" title="Палітра" note="Золото — лише акцент: лінії, маркери, фокус на темному. Primary — ink-900.">
        <div className="space-y-12">
          {PALETTE.map((g) => (
            <div key={g.group}>
              <h3 className="type-eyebrow mb-4">{g.group}</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {g.items.map((s) => (
                  <div key={s.token}>
                    <div className={`${s.swatch} ${s.label} flex aspect-[4/3] items-end border border-border p-3`}>
                      <span className="type-caption font-medium">{s.hex}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{s.token}</p>
                    <p className="type-caption text-muted-foreground">{s.role}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="type-eyebrow pb-3 text-left">Контраст (WCAG 2.x, розраховано)</caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Пара</th>
                <th className="py-2 pr-4 font-medium">Контраст</th>
                <th className="py-2 font-medium">Застосування</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST.map((c) => (
                <tr key={c.pair} className="border-b border-border">
                  <td className="py-2.5 pr-4">{c.pair}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{c.ratio}</td>
                  <td className="py-2.5">{c.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="typography"
        title="Типографіка"
        note="Playfair Display 400/500 + italic 400 для заголовків; Geist 400/500/600 для інтерфейсу. Верхній регістр — лише eyebrow, навігація та кнопки."
      >
        <div className="space-y-2">
          <Row label="Display — Playfair 400">
            <p className="type-display">Прикраси з характером</p>
          </Row>
          <Row label="H1 — Playfair 400">
            <p className="type-h1">
              Колекція <em className="italic">нових</em> надходжень
            </p>
          </Row>
          <Row label="H2 — Playfair 400">
            <p className="type-h2">Золото та срібло</p>
          </Row>
          <Row label="H3 — Playfair 500">
            <p className="type-h3">Кільця й каблучки</p>
          </Row>
          <Row label="Body L — Geist 18">
            <p className="type-body-lg max-w-xl">Вступний абзац: довжина рядка 60–72 символи, висота рядка 1.6.</p>
          </Row>
          <Row label="Body — Geist 16">
            <p className="type-body max-w-xl">Основний текст інтерфейсу та описів виробів, природний регістр.</p>
          </Row>
          <Row label="Body S — Geist 14">
            <p className="type-body-sm max-w-xl text-muted-foreground">Допоміжний текст, підказки до полів.</p>
          </Row>
          <Row label="Caption — Geist 13">
            <p className="type-caption text-muted-foreground">Метал · Проба · Вага</p>
          </Row>
          <Row label="Eyebrow — 12, caps">
            <p className="type-eyebrow">Нові надходження</p>
          </Row>
          <Row label="Nav — 13, caps">
            <p className="type-nav">Каталог</p>
          </Row>
          <Row label="Price — tabular">
            <p className="type-price">12 450 ₴</p>
            <p className="type-price-lg">128 900 ₴</p>
          </Row>
        </div>
      </Section>

      <Section id="foundations" title="Відступи, сітка, скруглення, рух">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="type-eyebrow mb-4">Відступи (база 4 px)</h3>
            <div className="space-y-2">
              {[
                ["4", "size-1"],
                ["8", "size-2"],
                ["12", "size-3"],
                ["16", "size-4"],
                ["24", "size-6"],
                ["32", "size-8"],
                ["48", "size-12"],
                ["64", "size-16"],
                ["96", "size-24"],
              ].map(([px, cls]) => (
                <div key={px} className="flex items-center gap-4">
                  <span className="type-caption w-10 text-muted-foreground tabular-nums">{px}</span>
                  <span className={`${cls} bg-gold-500`} aria-hidden />
                </div>
              ))}
            </div>
            <p className="type-body-sm mt-6 text-muted-foreground">
              Секція: 64 px (mobile) → 96 px (від 768) → 128 px (від 1280). Поля: 20 → 32 → 48 px.
            </p>
          </div>

          <div>
            <h3 className="type-eyebrow mb-4">Контейнери</h3>
            <ul className="type-body-sm space-y-2">
              <li>
                <code className="type-caption">container-site</code> — 1280 px
              </li>
              <li>
                <code className="type-caption">container-wide</code> — 1440 px (hero, каталог)
              </li>
              <li>
                <code className="type-caption">container-narrow</code> — 720 px (тексти, FAQ)
              </li>
            </ul>

            <h3 className="type-eyebrow mt-10 mb-4">Скруглення</h3>
            <div className="flex flex-wrap gap-6">
              {[
                ["0", "rounded-none", "Фото, картки"],
                ["2.4 px", "rounded-sm", "Кнопки, поля"],
                ["4 px", "rounded-lg", "Діалог"],
                ["Коло", "rounded-full", "Icon-кнопки"],
              ].map(([name, cls, use]) => (
                <div key={name}>
                  <div className={`${cls} size-16 border border-line-strong bg-ivory-100`} aria-hidden />
                  <p className="mt-2 text-sm font-medium">{name}</p>
                  <p className="type-caption text-muted-foreground">{use}</p>
                </div>
              ))}
            </div>

            <h3 className="type-eyebrow mt-10 mb-4">Рух</h3>
            <ul className="type-body-sm space-y-1.5 text-muted-foreground">
              <li>150 мс — колір, фокус · 250 мс — кнопки, посилання</li>
              <li>450 мс — меню, діалоги · 700 мс — зображення</li>
              <li>
                Easing <code className="type-caption">ease-luxe</code> = cubic-bezier(0.22, 1, 0.36, 1)
              </li>
              <li>Анімуємо лише opacity і transform · prefers-reduced-motion вимикає анімації</li>
            </ul>
            <div className="group mt-4 size-24 overflow-hidden bg-ivory-200">
              <div className="flex size-full items-center justify-center transition-transform duration-700 ease-luxe group-hover:scale-[1.08]">
                <Gem className="size-8 text-ink-500" strokeWidth={1} aria-hidden />
              </div>
            </div>
            <p className="type-caption mt-2 text-muted-foreground">Наведіть курсор: zoom зображення, 700 мс.</p>
          </div>
        </div>
      </Section>

      <Section id="buttons" title="Кнопки" note="Висоти: sm 36, default 44, lg 52. Підпис великими літерами лише у default / outline / secondary.">
        <div>
          <Row label="default (primary)">
            <Button size="sm">Каталог</Button>
            <Button>Замовити</Button>
            <Button size="lg">Переглянути колекцію</Button>
            <Button disabled>Недоступно</Button>
          </Row>
          <Row label="outline">
            <Button variant="outline" size="sm">
              Фільтри
            </Button>
            <Button variant="outline">Детальніше</Button>
            <Button variant="outline" size="lg">
              Нові надходження
            </Button>
            <Button variant="outline" disabled>
              Недоступно
            </Button>
          </Row>
          <Row label="secondary">
            <Button variant="secondary">Секундарна</Button>
          </Row>
          <Row label="ghost / link">
            <Button variant="ghost">Скинути</Button>
            <Button variant="link">Читати далі</Button>
          </Row>
          <Row label="destructive">
            <Button variant="destructive">Видалити</Button>
          </Row>
          <Row label="icon (круглі)">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Приклад">
              <Gem />
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Приклад">
              <Gem />
            </Button>
          </Row>
        </div>
        <p className="type-body-sm mt-4 text-muted-foreground">
          Hover: primary світлішає, outline заливається графітом. Active: зсув на 1 px. Disabled: 50 % прозорості.
        </p>
      </Section>

      <Section id="links" title="Посилання">
        <div>
          <Row label="link-inline">
            <p className="type-body">
              Текст із <a href="#links" className="link-inline">підкресленим посиланням</a>, лінія темнішає при наведенні.
            </p>
          </Row>
          <Row label="link-nav">
            <a href="#links" className="type-nav link-nav">
              Каталог
            </a>
            <a href="#links" aria-current="page" className="type-nav link-nav">
              Поточна сторінка
            </a>
            <a href="#links" className="type-nav link-nav">
              Контакти
            </a>
          </Row>
        </div>
        <p className="type-body-sm mt-4 text-muted-foreground">
          Навігація: золота лінія 1 px росте зліва направо при наведенні та для aria-current.
        </p>
      </Section>

      <Section id="forms" title="Поля форми" note="Висота 44 px, 16 px шрифт (iOS не збільшує сторінку). Фокус — темна рамка та тонке кільце.">
        <div className="grid max-w-3xl gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-name">Ім&apos;я</Label>
            <Input id="ds-name" placeholder="Олександр" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-disabled">Вимкнене</Label>
            <Input id="ds-disabled" placeholder="Недоступно" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-invalid">З помилкою</Label>
            <Input id="ds-invalid" defaultValue="abc" aria-invalid="true" aria-describedby="ds-invalid-msg" />
            <p id="ds-invalid-msg" className="type-caption text-destructive">
              Вкажіть коректне значення
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-focus">Стан фокуса (статичний зразок)</Label>
            <Input id="ds-focus" defaultValue="Фокус" className="border-ring ring-1 ring-ring" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="ds-comment">Коментар</Label>
            <Textarea id="ds-comment" placeholder="Побажання до замовлення" />
          </div>
        </div>
      </Section>

      <Section id="tabs" title="Вкладки">
        <div className="space-y-10">
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">Опис</TabsTrigger>
              <TabsTrigger value="b">Характеристики</TabsTrigger>
              <TabsTrigger value="c">Доставка</TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="type-body-sm pt-4 text-muted-foreground">
              Варіант default — як в адмінці.
            </TabsContent>
            <TabsContent value="b" className="type-body-sm pt-4 text-muted-foreground">
              Вміст вкладки «Характеристики».
            </TabsContent>
            <TabsContent value="c" className="type-body-sm pt-4 text-muted-foreground">
              Вміст вкладки «Доставка».
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="a">
            <TabsList variant="line" className="gap-6">
              <TabsTrigger value="a" className="px-0">
                Опис
              </TabsTrigger>
              <TabsTrigger value="b" className="px-0">
                Характеристики
              </TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="type-body-sm pt-4 text-muted-foreground">
              Варіант line: золота лінія 1 px під активною вкладкою.
            </TabsContent>
            <TabsContent value="b" className="type-body-sm pt-4 text-muted-foreground">
              Вміст вкладки «Характеристики».
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      <Section id="dialog" title="Діалог" note="Радіус 4 px, без blur-ефекту, поява 300 мс. Демонстрація без відправки даних.">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Відкрити діалог</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Заголовок діалогу</DialogTitle>
              <DialogDescription>Короткий опис дії. Це лише візуальний зразок.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-dialog-input">Поле</Label>
              <Input id="ds-dialog-input" placeholder="Текст" />
            </div>
            <DialogFooter showCloseButton>
              <Button>Підтвердити</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <section id="surfaces" className="border-t border-border">
        <div className="bg-ivory-100 section-y">
          <div className="container-site">
            <p className="type-eyebrow">surfaces</p>
            <h2 className="type-h2 mt-3">Світла поверхня (ivory-100)</h2>
            <p className="type-body mt-3 max-w-xl text-muted-foreground">
              Чергова секція на світлому тлі. Картки — paper без рамки та тіні, відділення лише тоном.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button>Основна дія</Button>
              <Button variant="outline">Другорядна дія</Button>
            </div>
          </div>
        </div>

        <div className="surface-ink section-y">
          <div className="container-site">
            <p className="type-eyebrow">surface-ink</p>
            <h2 className="type-h2 mt-3">
              Темна поверхня <em className="italic">graphite</em>
            </h2>
            <p className="type-body mt-3 max-w-xl text-muted-foreground">
              Усередині .surface-ink семантичні токени змінюються автоматично: foreground, muted-foreground, border, primary.
            </p>
            <div className="mt-6 h-px w-16 bg-gold" aria-hidden />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button>Основна дія</Button>
              <Button variant="outline">Другорядна дія</Button>
              <Button variant="ghost">Ghost</Button>
              <a href="#surfaces" className="link-inline">
                Посилання
              </a>
            </div>
            <div className="mt-8 grid max-w-md gap-2">
              <Label htmlFor="ds-ink-input">Поле на темному</Label>
              <Input id="ds-ink-input" placeholder="Email" />
            </div>
          </div>
        </div>
      </section>

      <Section
        id="focus"
        title="Стани фокуса"
        note="Клавіатурний фокус: контур 2 px ink-900 зі зсувом 2 px; на темному — gold-300. Нижче статичні зразки; натисніть Tab, щоб побачити справжній фокус."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-4 bg-background p-6 ring-1 ring-border">
            <span className="type-caption w-full text-muted-foreground">На світлому</span>
            <Button className="outline-2 outline-offset-2 outline-ring">Primary</Button>
            <Button variant="outline" className="outline-2 outline-offset-2 outline-ring">
              Outline
            </Button>
            <a href="#focus" className="link-inline outline-2 outline-offset-4 outline-ring">
              Посилання
            </a>
          </div>
          <div className="surface-ink flex flex-wrap items-center gap-4 p-6">
            <span className="type-caption w-full text-muted-foreground">На темному</span>
            <Button className="outline-2 outline-offset-2 outline-ring">Primary</Button>
            <Button variant="outline" className="outline-2 outline-offset-2 outline-ring">
              Outline
            </Button>
            <a href="#focus" className="link-inline outline-2 outline-offset-4 outline-ring">
              Посилання
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="type-caption text-muted-foreground">Реальний фокус (Tab):</span>
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <a href="#focus" className="link-inline">
            Посилання
          </a>
          <Input aria-label="Приклад поля" placeholder="Поле" className="max-w-48" />
        </div>
      </Section>

      <Section
        id="product-card"
        title="Картка товару"
        note="Реальний компонент ProductCard у реальній сітці ProductGrid. Дані умовні — це не товари магазину. Стани: у наявності з характеристиками, без характеристик, зарезервовано, продано без ціни."
      >
        <ProductGrid products={SAMPLE_PRODUCTS} />
        <ul className="type-body-sm mt-10 max-w-2xl list-disc space-y-1.5 pl-5 text-muted-foreground">
          <li>Вся картка — одне посилання. Hover: фото 1.03 за 700 мс, підкреслення назви.</li>
          <li>Характеристики показуються лише ті, що є в даних (метал, проба, вага).</li>
          <li>Друге фото (якщо є) плавно проявляється при hover; без фото — нейтральний плейсхолдер.</li>
          <li>Статус «Продано» і «Зарезервовано» — коротка позначка на фото; для проданого зображення приглушене.</li>
          <li>Замовлення оформлюється на сторінці товару, у картці немає кнопок і рамок.</li>
        </ul>
      </Section>
    </main>
  )
}
