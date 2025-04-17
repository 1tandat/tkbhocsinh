import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subject } from '../types/subject';
import ScheduleGrid from '../components/ScheduleGrid';

interface SchedulePageProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

function SchedulePage({ subjects, setSubjects }: SchedulePageProps) {
  const navigate = useNavigate();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    navigate('/add', { state: { subject } }); // Chuyển hướng đến AddSubjectPage với dữ liệu môn học
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">Weekly Schedule</h2>
        <Link to="/add" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Subject
        </Link>
      </div>
      <ScheduleGrid subjects={subjects} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default SchedulePage;