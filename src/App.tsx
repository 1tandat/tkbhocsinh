import { Routes, Route } from 'react-router-dom';
import AddSubjectPage from './pages/AddSubjectPage';
import SchedulePage from './pages/SchedulePage';
import { useState, useEffect } from 'react';
import { Subject } from './types/subject';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';

function App() {
  const [subjects, setSubjects] = useState<Subject[]>(loadFromLocalStorage('subjects') || []);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    saveToLocalStorage('subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="p-4 bg-blue-600 text-white flex justify-between">
        <h1>Personal Study Schedule</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <Routes>
        <Route path="/" element={<SchedulePage subjects={subjects} setSubjects={setSubjects} />} />
        <Route
          path="/add"
          element={<AddSubjectPage subjects={subjects} setSubjects={setSubjects} />}
        />
      </Routes>
    </div>
  );
}

export default App;