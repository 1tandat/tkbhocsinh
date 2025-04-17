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

    // Kiểm tra xung đột lịch học, bỏ qua môn học đang chỉnh sửa
    const otherSubjects = editingSubject
      ? subjects.filter((s) => s.id !== editingSubject.id)
      : subjects;
    if (checkScheduleConflict(newSubject, otherSubjects)) {
      setError('Schedule conflict detected!');
      return;
    }

    if (editingSubject) {
      // Cập nhật môn học
      setSubjects(subjects.map((s) => (s.id === editingSubject.id ? newSubject : s)));
    } else {
      // Thêm môn học mới
      setSubjects([...subjects, newSubject]);
    }
    navigate('/');
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">
            Subject Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="instructor" className="block">
            Instructor
          </label>
          <input
            id="instructor"
            type="text"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block">Days</label>
          {daysOfWeek.map((day) => (
            <label key={day} className="inline-flex items-center mr-4">
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
                className="mr-1"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="startTime" className="block">
            Start Time
          </label>
          <input
            id="startTime"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block">
            End Time
          </label>
          <input
            id="endTime"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="room" className="block">
            Room
          </label>
          <input
            id="room"
            type="text"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="color" className="block">
            Color
          </label>
          <input
            id="color"
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingSubject ? 'Update Subject' : 'Add Subject'}
        </button>
      </form>
    </div>
  );
}

export default AddSubjectPage;