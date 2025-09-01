import React from 'react';
import Timeline from 'react-native-timeline-flatlist';
import {useAppTheme} from "@/hooks/useTheme";

type BookingTimelineProps = {
    statuses: string[];
    currentStatus?: string;

};

const BookingTimeline = ({statuses, currentStatus}: BookingTimelineProps) => {
    const {theme: colorScheme, setTheme} = useAppTheme();
    const activeIndex = statuses.findIndex(
        (status) => status.toLowerCase() === (currentStatus || '').toLowerCase()
    );

    const data = statuses.map((status, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;
        return {
            title: status,
            circleColor: isActive ? '#ffa600' : isDone ? '#ffcc00' : '#d1d5db',
            lineColor: isDone ? '#ffcc00' : '#d1d5db',
            description: isActive ? 'Aktuell status' : '',
        };
    });

    return (
        <Timeline
            data={data}
            innerCircle="none"
            circleSize={16}
            circleStyle={{
                top: 0,
            }}
            titleStyle={{
                fontSize: 16,
                fontWeight: '600',
                bottom: 10,
                color:colorScheme === 'dark' ? 'white' : 'black',
            }}
            descriptionStyle={{
                fontSize: 10,
                color: colorScheme === 'dark' ? 'white' : 'black',
                bottom: 8,
            }}
            separator={false}
            showTime={false}
            style={{paddingTop: 10}}
            lineWidth={3}
            renderFullLine={false}


        />
    );
};

export default BookingTimeline;