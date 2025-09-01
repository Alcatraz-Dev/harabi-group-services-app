import {defineField, defineType} from "sanity";

export const serviceType = defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Service Title',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'image',
            type: 'image',
            title: 'Service Image',
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            type: 'text',
            title: 'Service Description',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'featured',
            type: 'boolean',
            title: 'Featured on Carousel',
            description: 'Enable this to show the service in the 3D carousel',
            initialValue: false,
        }),
        defineField({
            name: 'badges',
            type: 'array',
            title: 'Badges',
            description: 'Optional tags that describe this service (e.g., Fast, Affordable)',
            of: [
                {
                    type: 'string',
                },
            ],
            options: {
                layout: 'tags',
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
        },
    },
})