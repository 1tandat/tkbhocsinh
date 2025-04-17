import { Subject } from '../types/subject';

export function checkScheduleConflict(newSubject: Subject, existingSubjects: Subject[]): boolean {
  return existingSubjects.some((subject) =>
    subject.days.some((day) =>
      newSubject.days.includes(day) &&
      !(
        newSubject.endTime <= subject.startTime ||
        newSubject.startTime >= subject.endTime
      )
    )
  );
}