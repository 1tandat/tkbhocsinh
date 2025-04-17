import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    navigate('/add', { state: { subject } });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(subjects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSubjects: Subject[] = JSON.parse(e.target?.result as string);
          const isValid = importedSubjects.every(
            (subject) =>
              subject.id &&
              subject.name &&
              subject.instructor &&
              Array.isArray(subject.days) &&
              subject.startTime &&
              subject.endTime &&
              subject.room &&
              subject.color
          );
          if (isValid) {
            setSubjects(importedSubjects);
            alert('Imported successfully!');
          } else {
            alert('Invalid JSON format for subjects.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Weekly Schedule</h2>
        <div className="space-x-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            Export File
          </button>
          <label className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm cursor-pointer">
            Import File
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          <Link
            to="/add"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Add Lesson
          </Link>
        </div>
      </div>
      <ScheduleGrid subjects={subjects} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default SchedulePage;