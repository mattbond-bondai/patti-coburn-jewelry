'use client'

import { useState } from 'react'
import Image from 'next/image'
import { asset } from '@/data/site'

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const current = images[active] || images[0]

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-border">
        <Image
          src={asset(current)}
          alt={alt}
          width={720}
          height={900}
          priority
          className="h-auto w-full"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              aria-label={`View photo ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-16 w-14 overflow-hidden rounded-lg ring-2 transition ${
                i === active ? 'ring-primary' : 'ring-border hover:ring-primary/50'
              }`}
            >
              <Image
                src={asset(img)}
                alt=""
                width={112}
                height={128}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
