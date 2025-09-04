import { defineField, defineType } from "sanity";

export const bookingPeriodType = defineType({
    name: "bookingPeriod",
    title: "Booking Period",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Month",
            type: "string",
            description: "Select the month this booking period belongs to",
            options: {
                list: [
                    { title: "January", value: "January" },
                    { title: "February", value: "February" },
                    { title: "March", value: "March" },
                    { title: "April", value: "April" },
                    { title: "May", value: "May" },
                    { title: "June", value: "June" },
                    { title: "July", value: "July" },
                    { title: "August", value: "August" },
                    { title: "September", value: "September" },
                    { title: "October", value: "October" },
                    { title: "November", value: "November" },
                    { title: "December", value: "December" },
                ],
                layout: "dropdown",
            },
            validation: (Rule) => Rule.required(),
        }),


        // 🔹 Slots for each date
        defineField({
            name: "slots",
            title: "Daily Slots",
            type: "array",
            of: [
                defineField({
                    name: "slot",
                    title: "Slot",
                    type: "object",
                    fields: [
                        {
                            name: "date",
                            title: "Date",
                            type: "date",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "place",
                            title: "Place",
                            type: "string",
                            options: {
                                list: [
                                    // Tunisia
                                    { title: "Tunis", value: "Tunis" },
                                    { title: "Sfax", value: "Sfax" },
                                    { title: "Sousse", value: "Sousse" },
                                    { title: "Bizerte", value: "Bizerte" },
                                    { title: "Kairouan", value: "Kairouan" },
                                    { title: "Gabès", value: "Gabès" },
                                    // Sweden
                                    { title: "Stockholm", value: "Stockholm" },
                                    { title: "Gothenburg", value: "Gothenburg" },
                                    { title: "Malmö", value: "Malmö" },
                                    { title: "Uppsala", value: "Uppsala" },
                                    { title: "Västerås", value: "Västerås" },
                                ],
                                layout: "dropdown",
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "startTime",
                            title: "Start Time",
                            type: "string",
                            options: {
                                list: [
                                    { title: "08:00 AM", value: "08:00" },
                                    { title: "09:00 AM", value: "09:00" },
                                    { title: "10:00 AM", value: "10:00" },
                                    { title: "11:00 AM", value: "11:00" },
                                    { title: "12:00 PM", value: "12:00" },
                                    { title: "01:00 PM", value: "13:00" },
                                    { title: "02:00 PM", value: "14:00" },
                                    { title: "03:00 PM", value: "15:00" },
                                    { title: "04:00 PM", value: "16:00" },
                                    { title: "05:00 PM", value: "17:00" },
                                ],
                                layout: "dropdown",
                            },
                        },
                        {
                            name: "endTime",
                            title: "End Time",
                            type: "string",
                            options: {
                                list: [
                                    { title: "09:00 AM", value: "09:00" },
                                    { title: "10:00 AM", value: "10:00" },
                                    { title: "11:00 AM", value: "11:00" },
                                    { title: "12:00 PM", value: "12:00" },
                                    { title: "01:00 PM", value: "13:00" },
                                    { title: "02:00 PM", value: "14:00" },
                                    { title: "03:00 PM", value: "15:00" },
                                    { title: "04:00 PM", value: "16:00" },
                                    { title: "05:00 PM", value: "17:00" },
                                    { title: "06:00 PM", value: "18:00" },
                                ],
                                layout: "dropdown",
                            },
                        },
                    ],
                }),
            ],
        }),

        // 🔹 Period colors
        defineField({
            name: "colorTunisia",
            title: "Tunisia Period Color",
            type: "string",
            description: "Custom color for Tunisia dates (e.g., #f59e0b)",
            initialValue: "#f59e0b",
        }),
        defineField({
            name: "colorSweden",
            title: "Sweden Period Color",
            type: "string",
            description: "Custom color for Sweden dates (e.g., #3b82f6)",
            initialValue: "#3b82f6",
        }),
    ],
});