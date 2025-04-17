import { Subject } from '../types/subject';

interface ScheduleGridProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
  onEdit: (subject: Subject) => void;
}

function ScheduleGrid({ subjects, onDelete, onEdit }: ScheduleGridProps) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 to 21:00

  const getSubjectAt = (day: string, hour: number) => {
    return subjects.filter((subject) => {
      const startHour = parseInt(subject.startTime.split(':')[0]);
      const endHour = parseInt(subject.endTime.split(':')[0]);
      return subject.days.includes(day) && hour >= startHour && hour < endHour;
    });
  };

  return (
    <div className="w-full flex justify-center">
      {/* Khung bao quanh tuần, căn giữa */}
      <div className="max-w-6xl w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg p-4 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Week Schedule
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-r-4 border-white dark:border-gray-700 p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold sticky left-0 z-10">
                  Time
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={day}
                    className={`p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold min-w-[160px] ${
                      index < daysOfWeek.length - 1 ? 'border-r-4 border-white dark:border-gray-700' : ''
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, hourIndex) => (
                <tr
                  key={hour}
                  className={hourIndex < hours.length - 1 ? 'border-b-4 border-white dark:border-gray-700' : ''}
                >
                  <td className="border-r-4 border-white dark:border-gray-700 p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 sticky left-0 z-10">
                    {hour}:00 - {hour + 1}:00
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    const subjectsAtTime = getSubjectAt(day, hour);
                    return (
                      <td
                        key={`${day}-${hour}`}
                        className={`p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-w-[160px] ${
                          dayIndex < daysOfWeek.length - 1 ? 'border-r-4 border-white dark:border-gray-700' : ''
                        }`}
                      >
                        {subjectsAtTime.map((subject) => (
                          <div
                            key={subject.id}
                            className="p-4 m-1 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: subject.color }}
                          >
                            <p className="text-white font-semibold text-sm">{subject.name}</p>
                            <p className="text-white text-xs">{subject.room}</p>
                            <p className="text-white text-xs mt-1">
                              {subject.startTime} - {subject.endTime}
                            </p>
                            <p className="text-white text-xs">
                              Instructor: {subject.instructor}
                            </p>
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => onEdit(subject)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(subject.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleGrid;