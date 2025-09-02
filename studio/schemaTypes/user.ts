
import { defineField, defineType } from "sanity";


export const userType = defineType({
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        defineField({
            name: 'clerkId',
            title: 'Clerk ID',
            type: 'string',
            description: 'Unique ID from Clerk used to link auth account',
            validation: Rule => Rule.required().error('Clerk ID is required')
        }),
        defineField({
            name: 'fullName',
            title: 'Full Name',
            type: 'string',

        }),
        defineField({

            name: 'firstName',
            type: 'string',
            title: 'Förnamn',
        }),
        defineField(
        {
            name: 'lastName',
            type: 'string',
            title: 'Efternamn',
        }),

        defineField({
            name: 'userName',
            title: 'User Name',
            type: 'string',
            // validation: Rule => Rule.required().email()
        }),

        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'avatarUrl',
            title: 'Avatar URL',
            type: 'url',
        }),
        defineField({
            name: 'phoneNumber',
            title: 'Phone Number',
            type: 'string',
        }),

        defineField({
            name: 'referralCode',
            title: 'Referral Code',
            type: 'string',
        }),
        defineField({
            name: 'referredBy',
            title: 'Referred By',
            type: 'reference',
            to: [{ type: 'user' }],
        }),
        defineField({
            name: 'points',
            title: 'Points',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            initialValue: 'sv',
            options: {
                list: [
                    { title: 'Swedish', value: 'sv' },
                    { title: 'English', value: 'en' },
                    { title: 'Arabic', value: 'ar' },
                    { title: 'French', value: 'fr' },
                ],
            },
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email'
        },
        prepare(selection) {
            const { firstName, lastName, email } = selection;
            return {
                title: `${firstName || ''} ${lastName || ''}`.trim(),
                subtitle: email
            };
        }
    }


});