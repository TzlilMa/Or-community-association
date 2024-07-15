import { saveAs } from 'file-saver';

const generateICS = (event) => {
  const start = new Date(event.date.seconds * 1000).toISOString().replace(/-|:|\.\d+/g, "");
  const end = new Date((event.date.seconds + 3600) * 1000).toISOString().replace(/-|:|\.\d+/g, ""); // assuming 1 hour duration

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  saveAs(blob, `${event.name}.ics`);
};

export default generateICS;
