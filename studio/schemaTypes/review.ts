import {defineField, defineType} from "sanity";

export const reviewType = defineType({
    name: 'review',
    title: 'Reviews',
    type: 'document',
    fields: [
        defineField({
            name: 'userEmail',
            title: 'User Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'userName',
            title: 'User Name',
            type: 'string',
        }),
        defineField({
            name: 'avatar',
            title: 'Avatar',
            type: 'string',

        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: 'comment',
            title: 'Comment',
            type: 'text',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{type: 'category'}],
        }),
        defineField({
            name: 'provider',
            title: 'Provider',
            type: 'reference',
            to: [{type: 'provider'}],
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),

    ],
});