import {defineField, defineType} from "sanity";

export const categoryType = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required(),
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
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'useCoverImageAsIcon',
            title: 'Use Cover Image as Icon',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'provider',
            title: 'Provider',
            type: 'reference',
            to: [{type: 'provider'}],
            validation: Rule => Rule.required(),
        }),

    ],
    preview: {
        select: {
            title: 'title',
            media: 'icon',
            description: 'description',
        },
        prepare({title, media, description}) {
            return {
                title,
                media,
                subtitle: description,
            };
        },
    },
});