
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sv'; // اللغة السويدية

dayjs.extend(relativeTime);
dayjs.locale('sv');

export function formatReviewDate(dateString: string): string {
    const date = dayjs(dateString);
    const now = dayjs();

    const diffMinutes = now.diff(date, 'minute');
    if (diffMinutes < 60) {
        return date.fromNow(); // مثل: "för 2 minuter sedan"
    }

    return date.format('D MMM YYYY'); // مثل: "12 maj 2025"
}