import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      brand: z.string().min(1),
      category: z.enum(['snacks', 'bebidas', 'ramen']),
      flavor: z.string().optional(),
      presentation: z.string().optional(),
      description: z.string(),
      order: z.number().int().nonnegative(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1),
            kind: z.enum(['retouched-reference', 'synthetic-angle'])
          })
        )
        .min(1)
    })
})

export const collections = { products }
