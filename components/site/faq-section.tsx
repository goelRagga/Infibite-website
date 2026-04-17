"use client"

import { ArrowRight, Minus, Plus } from "lucide-react"
import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_DEFAULT_OPEN_ID, FAQ_ITEMS } from "@/lib/constants/faq"
import { cn } from "@/lib/utils"

export function FaqSection() {
  return (
    <section className="bg-black px-10 py-24 text-white sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-24 xl:gap-28">
        <div className="max-w-xl">
          <div className="flex items-center gap-3.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#0078B6]"
              aria-hidden
            >
              <ArrowRight className="size-[15px] text-[#0078B6]" strokeWidth={2} />
            </span>
            <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-white sm:text-xs">
              QUESTIONS &amp; ANSWERS
            </p>
          </div>
          <h2 className="mt-5 text-[1.625rem] font-bold leading-[1.08] tracking-tight text-white sm:mt-6 sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.06]">
            Frequently
            <br />
            asked Questions
          </h2>
          <p className="mt-5 text-base font-bold text-white sm:mt-6 sm:text-lg">
            Didn&apos;t get an answer?
          </p>
          <p className="mt-1.5 max-w-md text-sm font-normal leading-relaxed text-white sm:text-base">
            We will reach out to you in less than 2 hours!
          </p>
          <Link
            href="#contact"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-[#0078B6] bg-transparent px-8 text-sm font-bold text-[#0078B6] transition-colors hover:bg-[#0078B6]/10 sm:mt-6"
          >
            Leave a message
          </Link>
        </div>

        <Accordion
          defaultValue={FAQ_DEFAULT_OPEN_ID ? [FAQ_DEFAULT_OPEN_ID] : undefined}
          className="flex min-w-0 w-full flex-col gap-2"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-md border border-[#6C6C6C] bg-[#1A1A1A] px-3.5 py-0 not-last:border-b-0 sm:px-4"
            >
              <AccordionTrigger
                className={cn(
                  "items-center gap-2.5 py-2.5 hover:no-underline",
                  "[&_[data-slot=accordion-trigger-icon]]:hidden",
                  "text-xs font-bold leading-snug text-white sm:text-sm"
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center text-[#A0A0A0]" aria-hidden>
                  <Plus className="size-3.5 group-aria-expanded/accordion-trigger:hidden" strokeWidth={2} />
                  <Minus className="size-3.5 hidden group-aria-expanded/accordion-trigger:block" strokeWidth={2} />
                </span>
                <span className="flex-1 text-left">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-snug text-white/90 sm:text-sm sm:leading-snug">
                <p className="pb-2.5 pl-9">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
