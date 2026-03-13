import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('aboutSection')

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
            {t('p1')}
          </p>
          <p className="text-plum text-lg leading-relaxed">
            {t('p2')}
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
