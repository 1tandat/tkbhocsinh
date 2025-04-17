import { Subject } from '../types/subject';

interface ScheduleGridProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
  onEdit: (subject: Subject) => void;
}

function ScheduleGrid({ subjects, onDelete, onEdit }: ScheduleGridProps) {
  const hours = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getBlockPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const startMinutes = parseInt(startTime.split(':')[1]) / 60;
    const endMinutes = parseInt(endTime.split(':')[1]) / 60;
    const gridRowStart = (startHour - 7) * 60 + startMinutes + 2; // +2 for header row
    const gridRowEnd = (endHour - 7) * 60 + endMinutes + 2;
    return { gridRowStart, gridRowEnd };
  };

  return (
    <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1 bg-white dark:bg-gray-800 p-2 rounded shadow overflow-x-auto">
      <div className="sticky left-0 bg-white dark:bg-gray-800 z-10"></div>
      {days.map((day: string) => (
        <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-200">
          {day}
        </div>
      ))}
      {hours.map((hour) => (
        <div
          key={hour}
          className="sticky left-0 bg-white dark:bg-gray-800 z-10 text-right pr-2 text-gray-600 dark:text-gray-300"
        >
          {hour}
        </div>
      ))}
      {hours.flatMap(() => days.map((_, i) => <div key={i} className="border-t border-r border-gray-200 dark:border-gray-600"></div>))}
      {subjects.map((subject) =>
        subject.days.map((day) => {
          const { gridRowStart, gridRowEnd } = getBlockPosition(subject.startTime, subject.endTime);
          const dayIndex = days.indexOf(day) + 2; // +2 for time column
          return (
            <div
              key={`${subject.id}-${day}`}
              className="schedule-block relative p-2 rounded group"
              style={{
                gridColumn: dayIndex,
                gridRow: `${gridRowStart} / ${gridRowEnd}`,
                backgroundColor: subject.color,
              }}
            >
              <div className="text-sm text-white">
                {subject.name}
                <br />
                {subject.room}
              </div>
              <div className="absolute hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow z-20">
                <p>Instructor: {subject.instructor}</p>
                <p>Time: {subject.startTime} - {subject.endTime}</p>
                <button
                  onClick={() => onEdit(subject)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(subject.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ScheduleGrid;