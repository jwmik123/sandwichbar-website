import Image from 'next/image'

export function ImageSection() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
      <Image
        src="/images/The Sandwichbar 03.webp"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 h-[65%] aspect-[3/4]">
        <Image
          src="/images/The Sandwichbar 06.webp"
          alt="The Sandwich Bar"
          fill
          className="object-cover shadow-2xl"
          sizes="33vw"
        />
      </div>
    </section>
  )
}
