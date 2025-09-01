import {defineField, defineType} from "sanity";

// @ts-ignore
export const providerType = defineType({
    name: 'provider',
    title: 'Provider',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    { title: 'Tjänsteleverantör', value: 'Tjänsteleverantör' },        // Service Provider
                    { title: 'Underleverantör', value: 'Underleverantör' },          // Subcontractor / Supplier
                    { title: 'Administratör', value: 'Administratör' },               // Admin
                    { title: 'Kund', value: 'Kund' },                     // Customer / Client
                    { title: 'Supportmedarbetare', value: 'Supportmedarbetare' },        // Support Agent
                    { title: 'Chaufför', value: 'Chaufför' },                   // Driver (for transport/delivery apps)
                    { title: 'Städare', value: 'Städare' },                   // Cleaner (if cleaning services included)
                    { title: 'Tekniker', value: 'Tekniker' },               // Technician (for repair/installation)
                    { title: 'Chef', value: 'Chef' },                      // Manager
                    { title: 'Superadministratör', value: 'Superadministratör' },    // Super Admin
                ]
            },
        }),
        defineField({
            name: 'roleResponsibilities',
            title: 'Role Responsibilities',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Beskriv uppgifter och ansvar för denna roll',
            validation: (Rule) => Rule.min(1).warning('Det är bra att lägga till minst en uppgift'),
        }),
        defineField({
            name: 'phoneNumber',
            title: 'Telefonnummer',
            type: 'string',
            // @ts-ignore
            validation: (Rule) => Rule.required().regex(/^\+?[0-9]{7,15}$/, {
                name: 'phone number',
                invert: false,
                message: 'Skriv ett giltigt telefonnummer (t.ex. +46701234567)',
            }),
        }),
        defineField({
            name: 'whatsappNumber',
            title: 'WhatsApp-nummer',
            type: 'string',
            description: 'Ange ett nummer som är kopplat till WhatsApp',
            // @ts-ignore
            validation: (Rule) => Rule.required().regex(/^\+?[0-9]{7,15}$/, {
                name: 'WhatsApp number',
                invert: false,
                message: 'Skriv ett giltigt WhatsApp-nummer (t.ex. +46701234567)',
            }),
        }),

    ],
});