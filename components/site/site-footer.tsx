import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"
import { SITE } from "@/lib/constants"
import { SocialIcon } from "@/components/site/social-icons"

function LinkColumn({
  title,
  links,
}: {
  title: string
  links: readonly { readonly label: string; readonly href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold leading-none text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="text-sm text-white transition-opacity hover:opacity-80">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const { footer, brand } = SITE

  return (
    <footer className="text-white" style={{ backgroundColor: "#1D1D1F" }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.86fr)_minmax(0,0.86fr)_minmax(16rem,1.45fr)] lg:gap-6">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-none">
            <Link href="/" className="block w-fit leading-none">
              <Image
                src={brand.footerLogoSrc}
                alt={`${brand.name} ${brand.nameSuffix}`}
                width={176}
                height={91}
                className="block h-auto w-[8.75rem] max-w-full sm:w-44"
                unoptimized={brand.footerLogoSrc.endsWith(".svg")}
              />
            </Link>
            <p className="mt-3.5 text-sm leading-relaxed text-white sm:mt-4">{footer.blurb}</p>
            <a
              href={`mailto:${footer.email}`}
              className="mt-3.5 inline-flex items-center gap-2 text-sm text-white transition-opacity hover:opacity-80 sm:mt-4"
            >
              <Mail className="size-4 shrink-0 opacity-90" aria-hidden />
              {footer.email}
            </a>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-white sm:mt-6">{footer.storesLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="#download"
                className="inline-flex items-center rounded-md bg-black px-3 py-2 text-xs font-medium text-white ring-1 ring-white/15 transition-opacity hover:opacity-90"
              >
                Google Play
              </a>
              <a
                href="#download"
                className="inline-flex items-center rounded-md bg-black px-3 py-2 text-xs font-medium text-white ring-1 ring-white/15 transition-opacity hover:opacity-90"
              >
                App Store
              </a>
            </div>
          </div>

          <LinkColumn title="Product" links={footer.product} />
          <LinkColumn title="Support" links={footer.support} />

          <div className="w-full min-w-0">
            <h3 className="mb-3 text-sm font-bold leading-none text-white">{footer.newsletterTitle}</h3>
            <div className="flex w-full min-w-0 overflow-hidden rounded-md border border-white/20 bg-white">
              <input
                type="email"
                name="footer-email"
                placeholder={footer.emailPlaceholder}
                className="min-w-0 flex-1 border-0 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                autoComplete="email"
              />
              <button
                type="button"
                className="shrink-0 bg-black px-4 py-2.5 text-xs font-semibold text-white sm:text-sm"
              >
                {footer.subscribe}
              </button>
            </div>
            <h3 className="mb-3 mt-6 text-sm font-bold leading-none text-white sm:mt-8">{footer.socialTitle}</h3>
            <ul className="flex gap-2.5">
              {footer.socialIds.map((id) => {
                const entry = SITE.social.find((s) => s.id === id)
                if (!entry) return null
                return (
                  <li key={id}>
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90"
                      aria-label={entry.label}
                    >
                      <span className="[&_svg]:size-[1.125rem]">
                        <SocialIcon id={id} />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#0078B6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-center sm:text-left">{footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-end">
            {footer.legal.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap transition-opacity hover:opacity-80">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
