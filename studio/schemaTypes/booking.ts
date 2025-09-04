import { defineType, defineField } from "sanity";

export const bookingType = defineType({
    name: "booking",
    title: "Booking",
    type: "document",
    fields: [
        defineField({
            name: "customer",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Customer Email",
            type: "string",
            validation: (Rule) => Rule.email(),
        }),
        defineField({
            name: "phone",
            title: "Phone Number",
            type: "string",
        }),
        defineField({
            name: "service",
            title: "Service Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "date",
            title: "Booking Date",
            type: "date",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "startTime",
            title: "Start Time",
            type: "string",
        }),
        defineField({
            name: "endTime",
            title: "End Time",
            type: "string",
        }),
        defineField({
            name: "place",
            title: "Place",
            type: "string",
            options: {
                list: [
                    { title: "Tunis", value: "Tunis" },
                    { title: "Sfax", value: "Sfax" },
                    { title: "Sousse", value: "Sousse" },
                    { title: "Bizerte", value: "Bizerte" },
                    { title: "Kairouan", value: "Kairouan" },
                    { title: "Gabès", value: "Gabès" },
                    { title: "Stockholm", value: "Stockholm" },
                    { title: "Göteborg", value: "Göteborg" },
                    { title: "Malmö", value: "Malmö" },
                ],
            },
        }),
        defineField({
            name: "status",
            title: "Booking Status",
            type: "string",
            options: {
                list: [
                    { title: "In Progress", value: "in_progress" },
                    { title: "Confirmed", value: "confirmed" },
                    { title: "Completed", value: "completed" },
                    { title: "Cancelled", value: "cancelled" },
                ],
            },
            initialValue: "in_progress",
        }),
        defineField({
            name: "totalAmount",
            title: "Total Amount",
            type: "number",
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
    ],
});