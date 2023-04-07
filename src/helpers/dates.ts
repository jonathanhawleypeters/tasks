export const isToday = (date: number) => {
  const today = new Date();
  const  someDate = new Date(date);
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const isWithinOffsetDays = (date: number, offsetDays : number) => {
  const today = new Date();
  const offsetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays);

  const testDate = new Date(date);

  return offsetDays > 0
    ? testDate >= today && testDate <= offsetDate
    : testDate <= today && testDate >= offsetDate;
}

export const lastWeekExcludingToday = (date: number): boolean => {
  return !isToday(date) && isWithinOffsetDays(date, -7)
}

export const beforeLastWeek = (date: number): boolean => {
  return !isWithinOffsetDays(date, -7);
}

const timeFormatOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

export const timeForDisplay = (date: Date) => date
  .toLocaleTimeString(navigator.language, timeFormatOptions);

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric"
};

export const dateForDisplay = (date: Date): string => date
  .toLocaleDateString(navigator.language, dateOptions)
