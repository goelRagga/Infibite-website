import Image from "next/image"

export function BlendingBannerSection() {
  return (
    <section className="relative isolate flex h-[568px] w-full items-center overflow-hidden bg-black">
      <Image
        src="/assets/blending-banner.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/48 to-black/95"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl -translate-x-3 py-16 pl-3 pr-10 text-left sm:-translate-x-5 sm:pl-2 sm:py-20 lg:py-24">
        <div className="origin-left scale-[0.99]">
          <h2 className="max-w-4xl text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Stop blending in. Start standing out. <br />
            Get your{" "}
            <span className="bg-gradient-to-r from-[#6FA8FF] via-[#8FA9FF] to-[#C8A2D6] bg-clip-text text-transparent">
              InfiBite
            </span>{" "}
            Card today.
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-white/90 sm:mt-10 sm:text-xl md:text-2xl lg:text-3xl">
            Not everyone gets it. But your network will.
          </p>
        </div>
      </div>
    </section>
  )
}
