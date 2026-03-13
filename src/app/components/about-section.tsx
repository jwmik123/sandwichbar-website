import Image from 'next/image'

export function AboutSection() {
  return (
    <section className="bg-cream pb-20 px-6 relative overflow-hidden">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-10 text-center">
        {/* <div className="flex flex-col uppercase">
          <p className="text-plum text-4xl md:text-7xl font-bold leading-tight tracking-tight leading-tighter">
            Verse sandwiches, echte smaken.
          </p>
          <p className="text-plum text-4xl md:text-7xl font-bold leading-tight tracking-tight leading-tighter">
            Gewoon goed, elke dag.
          </p>
        </div> */}

        <div className="w-full flex justify-center">
          <Image
            src="/images/tsb-location.jpg"
            alt="The Sandwich Bar locatie"
            width={900}
            height={600}
            className="w-2/3 h-auto aspect-[5/3] object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 max-w-2xl">
          <p className="text-plum text-lg leading-relaxed">
            The Sandwich Bar is dé plek in Amsterdam voor een verse, klassieke sandwich — bereid met hoogwaardige, lokaal ingekochte ingrediënten. Van een simpele kaas tot onze beroemde pittige kip, aangevuld met verse sappen en baristakoffie van Bocca Amsterdam.
          </p>
          <p className="text-plum text-lg leading-relaxed">
            Kom langs voor een snelle lunch of een relaxed moment met vrienden. Haast? Bel van tevoren en wij zorgen dat je sandwich klaarstaat.
          </p>
        </div>
      </div>

      <Image
        src="/images/car.png"
        alt=""
        width={420}
        height={420}
        className="absolute bottom-0 right-0 opacity-10 pointer-events-none select-none"
        aria-hidden="true"
      />
    </section>
  )
}
