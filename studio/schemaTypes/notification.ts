import {defineField, defineType} from "sanity";

export const notificationType = defineType({
    name: 'notification',
    title: 'Notification',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
        defineField({
            name: 'message',
            type: 'text',
            title: 'Message',
        }),
        defineField({
            name: 'time',
            title: 'Time',
            type: 'datetime',
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            validation: Rule => Rule.required(),
            options: {
                list: [
                    {title: 'news', value: 'news'},
                    {title: 'Announcement', value: 'announcement'},
                    {title: 'reminder', value: 'reminder'},
                    {title: 'promotion', value: 'promotion'},
                    {title: 'warning', value: 'warning'},
                    {title: 'Message', value: 'message'},
                    {title: 'update', value: 'update'},
                    {title: 'verified', value: 'verified'},
                    {title: 'security', value: 'security'},
                    {title: 'email', value: 'email'},
                    {title: 'review', value: 'review'},
                    {title: 'admin', value: 'admin'},
                    {title: 'other', value: 'other'},
                ],
            },
        }),
        defineField({
            name: 'usersRead',
            title: 'Users Read',
            type: 'array',
            of: [{type: 'notificationRead'}],

        }),
    ]
});