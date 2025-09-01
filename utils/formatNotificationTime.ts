import { formatDistance, format, parseISO } from 'date-fns';

export const formatTime = (timeString: string) => {
    try {
        if (!timeString) return 'Unknown date';

        // If timeString is ISO (like from Sanity), parse it
        const date = parseISO(timeString);

        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        const relativeTime = formatDistance(date, new Date(), { addSuffix: true });
        const formattedDate = format(date, 'dd-MM-yyyy');

        return `${relativeTime} - ${formattedDate}`;
    } catch (error) {
        return 'Invalid date';
    }
};