import { defineCollection, z } from 'astro:content'

const productos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    precio: z.number(),
    categoria: z.string(),
    imagen: z.string(),
    galeria: z.array(z.string()).optional().default([]),
    destacado: z.boolean().default(false),
    descripcion: z.string(),
    fecha: z.date().optional().default(() => new Date()),
  }),
})

export const collections = { productos }
