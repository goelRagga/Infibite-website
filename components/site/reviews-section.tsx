import Image from "next/image"
import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { SocialIcon } from "@/components/site/social-icons"
import { Ticker } from "@/components/ui/ticker"

type SocialId = "instagram" | "facebook"

type Review = {
  name: string
  handle: string
  avatarImg: number
  network: SocialId
  body: ReactNode
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex size-[1.125rem] shrink-0 items-center justify-center rounded-full bg-[#1D9BF0]"
      title="Verified"
    >
      <Check className="size-2.5 text-white" strokeWidth={3} aria-hidden />
    </span>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="relative rounded-[14px] border border-white bg-[#0A0A0A] p-6">
      <div className="absolute top-5 right-5 text-[#6b6b6b] [&_svg]:size-[1.125rem]">
        <SocialIcon id={review.network} />
      </div>
      <header className="flex gap-3 pr-10">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
          <Image
            src={`https://i.pravatar.cc/128?img=${review.avatarImg}`}
            alt=""
            width={40}
            height={40}
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[0.9375rem] font-semibold tracking-tight text-white">{review.name}</span>
            <VerifiedBadge />
          </div>
          <p className="mt-0.5 text-sm text-[#A0A0A0]">{review.handle}</p>
        </div>
      </header>
      <div className="mt-4 text-[0.9375rem] leading-relaxed text-white">{review.body}</div>
    </article>
  )
}

const columns: Review[][] = [
  [
    {
      name: "Joanna Piter",
      handle: "@Joanna_piter",
      avatarImg: 45,
      network: "instagram",
      body: (
        <>
          <span className="font-semibold">We stopped printing cards for trade shows entirely.</span> People
          expect a tap or a QR scan now, and Infibite keeps our team on-brand while still letting each rep personalize links
          to their calendar, deck, and socials.
        </>
      ),
    },
    {
      name: "Marcus Chen",
      handle: "@marcus.c",
      avatarImg: 12,
      network: "facebook",
      body: (
        <>
          The first thing buyers notice is polish: typography, spacing, and motion all feel intentional.{" "}
          <span className="font-semibold">NFC plus QR in one flow</span> saved us from awkward “which app do you
          use?” moments at meetups.
        </>
      ),
    },
  ],
  [
    {
      name: "Sofia Martins",
      handle: "@sofiam",
      avatarImg: 26,
      network: "facebook",
      body: (
        <>
          We piloted digital cards with fifty field reps and measured fewer bad handoffs within weeks.{" "}
          <span className="font-semibold">Wrong phone numbers and outdated titles dropped sharply</span> because
          updates push instantly while the public link stays the same. Support used to chase “which version of the card is
          this?” — that noise is largely gone.
        </>
      ),
    },
    {
      name: "David Okonjo",
      handle: "@david.ok",
      avatarImg: 15,
      network: "facebook",
      body: (
        <>
          As an independent consultant, credibility is everything. I needed something that looks like a product, not a
          novelty.{" "}
          <span className="font-semibold">Clients comment on how fast it loads and how easy it is to save me</span>
          , especially right after workshops when attention is short. It has become part of how I close the room.
        </>
      ),
    },
  ],
  [
    {
      name: "Amira Hassan",
      handle: "@amira_h",
      avatarImg: 44,
      network: "instagram",
      body: (
        <>Our brand guidelines are strict, but the card still feels alive on Instagram and in DMs.</>
      ),
    },
    {
      name: "Priya Nair",
      handle: "@priya.n",
      avatarImg: 47,
      network: "instagram",
      body: (
        <>
          Dinner circuits used to mean stacks of paper I would never revisit. Now I hand over my phone for a second, they tap,
          and the card already has my calendar and preferred channel.{" "}
          <span className="font-semibold">Follow-through is higher because the friction after “nice to meet you”
          basically disappeared.</span>
        </>
      ),
    },
  ],
  [
    {
      name: "James Müller",
      handle: "@jamesm",
      avatarImg: 52,
      network: "facebook",
      body: (
        <>
          <span className="font-semibold">Smart digital business cards are only “simple” if the details are
          right.</span> Animations, contrast, and edge cases matter when you are asking someone to trust a link at a busy
          booth. This is the first implementation I have seen where NFC feels reliable, the layout holds on small screens, and
          the whole thing still looks premium under conference lighting
        </>
      ),
    },
    {
      name: "Omar Farouk",
      handle: "@omar.f",
      avatarImg: 60,
      network: "facebook",
      body: (
        <>
          Events are messy: gloves, badges, bad Wi‑Fi. We still need leads in the CRM the same day.{" "}
          That small operational win compounds across a season of shows — fewer errors, faster handoffs, and
          a cleaner story for sales when Monday arrives.
        </>
      ),
    },
  ],
]

export function ReviewsSection() {
  return (
    <section className="bg-black px-10 pt-10 pb-2 text-white sm:pt-12 lg:pt-14 lg:pb-3">
      <header className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-medium text-white italic sm:text-[0.9375rem]">
          Trusted By Professionals <span className="text-[#0078B6] not-italic">Worldwide</span>
        </p>
        <h2 className="mt-2 whitespace-nowrap text-[clamp(0.9375rem,2.8vw,1.75rem)] font-bold leading-tight tracking-tight">
          Smart digital <span className="text-[#0078B6]">business</span> cards designed for real-world networking.
        </h2>
        <p className="mt-2 text-lg text-white sm:text-xl">Your business, always ready to share.</p>
      </header>

      <div className="mx-auto mt-8 max-w-[1600px] px-4 sm:mt-10 sm:px-8 lg:mt-12 lg:px-14">
        <div className="relative h-[min(64vh,580px)] overflow-hidden sm:h-[min(66vh,640px)] lg:h-[min(72vh,720px)]">
          <div className="grid h-full min-h-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {columns.map((reviews, i) => (
              <Ticker
                key={i}
                direction="up"
                durationSec={4}
                gapClassName="gap-4"
                className="min-h-0"
              >
                {reviews.map((r, j) => (
                  <ReviewCard key={`${i}-${j}`} review={r} />
                ))}
              </Ticker>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black via-black/70 via-40% to-transparent sm:h-36"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black via-black/70 via-40% to-transparent sm:h-36"
          />
        </div>
      </div>
    </section>
  )
}
