import type { Metadata } from 'next'
import Scripture from '@/components/scripture'
import StoneGrid from '@/components/stone-grid'

export const metadata: Metadata = {
  title: 'Gems of Scripture | Bible Study on the Stones of the Bible',
  description:
    'Short devotional Bible studies on the gemstones of Scripture: the twelve foundation stones of Revelation 21, the pearl of great price, living stones, and more.'
}

const studies = [
  {
    title: 'The Twelve Foundation Stones',
    reference: 'Revelation 21:19-20',
    verse:
      'The foundations of the wall of the city were adorned with all kinds of precious stones.',
    body: [
      'John\u2019s vision of the New Jerusalem ends the Bible with color. After all the battles, exiles, and tears of Scripture, the story resolves in a city so secure that its foundations are made of gems \u2014 beauty where you would expect concrete.',
      'Foundations are usually buried. God puts His on display. The things He builds on \u2014 covenant, sacrifice, redemption \u2014 are not embarrassments to be hidden but treasures to be seen.',
      'As you consider each stone this week, ask: what has God laid in the foundation of my life that He might want brought into the light?'
    ]
  },
  {
    title: 'The Pearl of Great Price',
    reference: 'Matthew 13:45-46',
    verse:
      'The kingdom of heaven is like a merchant seeking beautiful pearls, who, when he had found one pearl of great price, went and sold all that he had and bought it.',
    body: [
      'A pearl is the only gem made by a living creature, and it is formed in response to an irritation \u2014 a grain of sand transformed, layer by layer, into something precious.',
      'Jesus says the kingdom is worth everything. The merchant does not sell all he has reluctantly; he does it with joy, because he knows the worth of what he has found.',
      'What \u201cirritations\u201d in your life might God be layering into pearls right now?'
    ]
  },
  {
    title: 'More Precious Than Rubies',
    reference: 'Proverbs 31:10',
    verse: 'Who can find a virtuous wife? For her worth is far above rubies.',
    body: [
      'Scripture prices godly character above the rarest stones on earth. Rubies can be mined, bought, and sold \u2014 a heart of wisdom and kindness cannot.',
      'This is why jewelry makes such a meaningful gift for the women of faith in our lives: not because the stones are precious, but because they point to a worth that outshines them.',
      'Who in your life needs to be reminded of her worth this week?'
    ]
  },
  {
    title: 'Living Stones',
    reference: '1 Peter 2:5',
    verse:
      'You also, as living stones, are being built up a spiritual house, a holy priesthood.',
    body: [
      'God is not only preparing a jeweled city for us \u2014 He is building one out of us. Peter says every believer is a living stone, shaped and set by the Master Builder.',
      'Stones in a wall touch each other. There are no free-floating gems in God\u2019s house; we are set side by side on purpose, bearing one another\u2019s weight.',
      'Whose weight is God asking you to help carry? And who is quietly carrying yours?'
    ]
  }
]

export default function BibleStudyPage() {
  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Bible study
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-5xl">
            Gems of Scripture
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            From the High Priest&apos;s breastpiece to the foundations of the New Jerusalem, God
            fills His Word with precious stones. These short devotional studies explore what they
            mean &mdash; and what they mean for you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-5 py-14">
        {studies.map((study) => (
          <article
            key={study.title}
            className="rounded-2xl border border-border bg-surface p-7 shadow-card md:p-9"
          >
            <h2 className="font-serif text-2xl text-text md:text-3xl">{study.title}</h2>
            <div className="mt-5">
              <Scripture reference={study.reference}>{study.verse}</Scripture>
            </div>
            <div className="mt-5 space-y-4 leading-relaxed text-muted">
              {study.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-text md:text-4xl">
              Study companion: the twelve stones
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Use this guide alongside the Glimpse of Heaven bracelet &mdash; one stone, one
              meditation at a time.
            </p>
          </div>
          <div className="mt-10">
            <StoneGrid />
          </div>
        </div>
      </section>
    </>
  )
}
