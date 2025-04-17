import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Subject } from '../types/subject';
import { checkScheduleConflict } from '../utils/time';

interface AddSubjectPageProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

function AddSubjectPage({ subjects, setSubjects }: AddSubjectPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const editingSubject = location.state?.subject as Subject | undefined;

  const [form, setForm] = useState({
    name: editingSubject?.name || '',
    instructor: editingSubject?.instructor || '',
    days: editingSubject?.days || ([] as string[]),
    startTime: editingSubject?.startTime || '',
    endTime: editingSubject?.endTime || '',
    room: editingSubject?.room || '',
    color: editingSubject?.color || '#ff0000',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setForm({
        name: editingSubject.name,
        instructor: editingSubject.instructor,
        days: editingSubject.days,
        startTime: editingSubject.startTime,
        endTime: editingSubject.endTime,
        room: editingSubject.room,
        color: editingSubject.color,
      });
    }
  }, [editingSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: editingSubject ? editingSubject.id : crypto.randomUUID(),
      ...form,
    };

    const otherSubjects = editingSubject
      ? subjects.filter((s) => s.id !== editingSubject.id)
      : subjects;
    if (checkScheduleConflict(newSubject, otherSubjects)) {
      setError('Schedule conflict detected!');
      return;
    }

    if (editingSubject) {
      setSubjects(subjects.map((s) => (s.id === editingSubject.id ? newSubject : s)));
    } else {
      setSubjects([...subjects, newSubject]);
    }
    navigate('/');
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {editingSubject ? 'Edit Lesson' : 'Add Lesson'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lesson Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructor
          </label>
          <input
            id="instructor"
            type="text"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Days</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  id={`day-${day}`}
                  type="checkbox"
                  checked={form.days.includes(day)}
                  onChange={(e) => {
                    const updatedDays = e.target.checked
                      ? [...form.days, day]
                      : form.days.filter((d) => d !== day);
                    setForm({ ...form, days: updatedDays });
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Time
          </label>
          <input
            id="startTime"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Time
          </label>
          <input
            id="endTime"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Room
          </label>
          <input
            id="room"
            type="text"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <input
            id="color"
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          {editingSubject ? 'Update Lesson' : 'Add Lesson'}
        </button>
      </form>
    </div>
  );
}

export default AddSubjectPage;