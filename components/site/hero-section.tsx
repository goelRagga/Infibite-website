import Image from "next/image"
import Link from "next/link"
import { SITE } from "@/lib/constants"

export function HeroSection() {
  return (
    <section
      className="relative isolate -mt-[var(--infibite-header-height)] flex max-h-[826px] min-h-[min(100dvh,826px)] flex-col overflow-hidden pt-[calc(var(--infibite-header-height)+3.5rem)] pb-10 sm:pb-16 lg:pt-[calc(var(--infibite-header-height)+5rem)] lg:pb-10"
      style={{ background: "var(--infibite-hero-fallback)" }}
    >
      <div className="absolute inset-0">
        <Image
          src={SITE.hero.media.backgroundSrc}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {SITE.hero.media.cloudOverlaySrc ? (
          <Image
            src={SITE.hero.media.cloudOverlaySrc}
            alt=""
            fill
            unoptimized={SITE.hero.media.cloudOverlaySrc.endsWith(".svg")}
            className="pointer-events-none object-cover object-center opacity-95"
            sizes="100vw"
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{ background: "var(--infibite-hero-overlay)" }}
          aria-hidden
        />
      </div>

      <div className="z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col gap-10 sm:gap-12 lg:contents">
          <div className="max-w-xl self-start lg:max-w-[28rem]">
            <div
              className="mb-7 inline-flex rounded-full p-[3px] shadow-sm"
              style={{
                background: "linear-gradient(90deg, #F58F70 0%, #5BADFF 100%)",
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white py-1 pr-4 pl-1 sm:gap-2.5 sm:pr-5 sm:pl-1.5">
                <span
                  className="rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white sm:text-xs"
                  style={{ background: "#3285EE" }}
                >
                  {SITE.hero.badgeNew}
                </span>
                <span
                  className="text-xs font-medium sm:text-sm"
                  style={{ color: "#4A5565" }}
                >
                  {SITE.hero.badgeIntro}{" "}
                  <span className="font-bold uppercase tracking-tight">{SITE.hero.badgeBrand}</span>
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12] xl:text-6xl">
              <span className="block md:whitespace-nowrap">{SITE.hero.headingBefore}</span>
              <span className="block md:whitespace-nowrap">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #5BADFF 0%, #6B9FD4 24%, #949BB8 50%, #E09A88 78%, #F58F70 100%)",
                  }}
                >
                  {SITE.hero.headingAccent}
                </span>
                <span className="text-white">. {SITE.hero.headingAfter}</span>
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--infibite-hero-muted)" }}
            >
              {SITE.hero.subheadingBefore}
              <br />
              {SITE.hero.subheadingAfter}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#nfc-card"
                className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
                style={{ background: "var(--infibite-brand)" }}
              >
                {SITE.hero.primaryCta}
              </Link>
              <Link
                href="#live-demo"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--infibite-brand)] bg-transparent px-8 text-sm font-semibold text-[var(--infibite-brand)] transition-colors hover:bg-[var(--infibite-outline-button-hover)]"
              >
                {SITE.hero.secondaryCta}
              </Link>
            </div>
          </div>

          {SITE.hero.media.productSrc ? (
            <div
              className="pointer-events-none relative z-10 mx-auto mt-10 w-full max-w-[22rem] shrink-0 sm:max-w-[26rem] lg:absolute lg:left-[clamp(0.75rem,calc(1153.45/1920*100vw),calc(100vw-633.0490112304688px-0.75rem))] lg:top-[calc(390/826*100%)] lg:mx-0 lg:mt-0 lg:max-w-none lg:shrink-0"
              style={{
                width: "min(100%, 633.0490112304688px)",
                height: "419.9999694824219px",
                opacity: 1,
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={SITE.hero.media.productSrc}
                  alt=""
                  fill
                  unoptimized={SITE.hero.media.productSrc.endsWith(".svg")}
                  className="object-contain object-bottom drop-shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
                  sizes="633px"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
