import { useState, useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths } from 'date-fns';

export function useCalendar(initialDate = new Date()) {
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(initialDate);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentCalendarMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentCalendarMonth]);

  const nextMonth = () => setCurrentCalendarMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentCalendarMonth(prev => subMonths(prev, 1));

  return {
    currentCalendarMonth,
    calendarDays,
    nextMonth,
    prevMonth,
    setCurrentCalendarMonth
  };
}
