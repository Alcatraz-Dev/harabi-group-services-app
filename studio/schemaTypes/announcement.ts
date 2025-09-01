import {defineField, defineType} from "sanity";

// @ts-ignore
export const announcementType = defineType({
    name: 'announcement',
    title: 'Announcement',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required().max(100),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
            validation: Rule => Rule.max(250),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Detailed description of the announcement',

            validation: Rule => Rule.max(2000),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'url',
            description: 'External URL to the announcement or related site',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https'],
            }),
        })

    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'image',
        },
    },
});