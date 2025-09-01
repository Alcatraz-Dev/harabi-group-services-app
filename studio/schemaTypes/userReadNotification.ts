import {defineField, defineType} from "sanity";

export const notificationReadType = defineType({
            name: 'notificationRead',
            title: 'Notification Read',
            type: 'object',
            fields: [
                // حقول الإشعار الأخرى ...
                defineField({
                    name: 'read', type: 'boolean', title: 'Read'
                }),
                defineField({name: 'readAt', type: 'datetime', title: 'Read At'}),

                defineField({name: 'userId', type: 'string', title: 'User ID'}),

            ],
        }
    )
;