import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del producto',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'precio',
      title: 'Precio ($ MXN)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'categoria' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'galeria',
      title: 'Galería de imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texto alternativo', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'destacado',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 5,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'imagen',
      precio: 'precio',
      categoria: 'categoria.title',
    },
    prepare({ title, media, precio, categoria }) {
      return {
        title,
        subtitle: `$${precio} MXN · ${categoria || 'Sin categoría'}`,
        media,
      }
    },
  },
})
