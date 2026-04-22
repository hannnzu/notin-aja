import { isBefore, startOfToday, isToday as dateFnsIsToday, parseISO, format, subDays, isSameDay } from 'date-fns';

export { subDays, isSameDay };

/**
 * Parses a string to a Date object, handling legacy 'Hari Ini' strings if any exist in the database.
 */
export const parseTaskDate = (dateStr) => {
    if (!dateStr || dateStr === 'Selesai') return null;
    if (dateStr === 'Hari Ini') return startOfToday();

    const parsed = parseISO(dateStr);
    if (isNaN(parsed)) return null;
    return parsed;
};

/**
 * Checks if a task is overdue.
 * @param {string} dateStr - The due date string.
 * @param {boolean} isCompleted - Whether the task is already completed.
 */
export const isTaskOverdue = (dateStr, isCompleted) => {
    if (isCompleted) return false;
    const date = parseTaskDate(dateStr);
    if (!date) return false;
    return isBefore(date, startOfToday());
};

/**
 * Checks if a task is due today.
 */
export const isTaskToday = (dateStr) => {
    const date = parseTaskDate(dateStr);
    if (!date) return false;
    return dateFnsIsToday(date);
};

/**
 * Formats a date string for display (e.g. 21 Okt).
 */
export const formatTaskDateDisplay = (dateStr) => {
    const date = parseTaskDate(dateStr);
    if (!date) return 'Tidak diatur';
    if (dateFnsIsToday(date)) return 'Hari Ini';

    try {
        // using Indonesian locale if needed, but native toLocaleDateString is fine
        // Or just use native for consistency with previous implementation
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
        return dateStr;
    }
};

/**
 * Gets today's date in YYYY-MM-DD format for inputs and defaults.
 */
export const getTodayDateString = () => {
    return format(startOfToday(), 'yyyy-MM-dd');
};
