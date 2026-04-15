import { ArrowRight, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SITE } from "@/lib/constants"
import { SocialIcon } from "@/components/site/social-icons"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div
        className="relative flex h-10 items-center px-4 text-xs sm:px-6 sm:text-sm"
        style={{
          background: "var(--infibite-topbar-bg)",
          color: "var(--infibite-topbar-foreground)",
        }}
      >
        <ul className="relative z-10 flex gap-2.5 sm:gap-3">
          {SITE.social.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex opacity-90 transition-opacity hover:opacity-100"
                aria-label={s.label}
              >
                <SocialIcon id={s.id} />
              </a>
            </li>
          ))}
        </ul>
        <p className="pointer-events-none absolute inset-x-10 mx-auto truncate text-center font-medium sm:inset-x-24">
          {SITE.topBar.tagline}
        </p>
      </div>

      <div
        className="border-b"
        style={{
          background: "var(--infibite-nav-bg)",
          borderColor: "var(--infibite-nav-border)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
          <Link href="/" className="relative inline-flex shrink-0 items-center">
            <Image
              src={SITE.brand.logoSrc}
              alt={`${SITE.brand.name} ${SITE.brand.nameSuffix}`}
              width={176}
              height={91}
              priority
              unoptimized
              className="h-14 w-auto sm:h-16 md:h-[4.5rem] lg:h-20"
            />
          </Link>

          <nav
            className="hidden min-w-0 flex-1 overflow-x-auto text-[0.8125rem] font-medium text-white md:flex md:justify-center md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden lg:text-[0.84375rem]"
            aria-label="Primary"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:gap-x-6">
              {SITE.nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-white"
                  >
                    {item.label}
                    {item.hasDropdown ? (
                      <ChevronDown className="size-3.5 shrink-0 text-white" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <Link href="#login" className="text-sm font-medium text-white">
              {SITE.auth.login}
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--infibite-brand)] px-4 py-2 text-sm font-semibold text-[var(--infibite-brand)] transition-colors hover:bg-[var(--infibite-outline-button-hover)]"
            >
              {SITE.auth.requestDemo}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
