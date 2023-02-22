export function getWeekDates() {
  const currentDate = new Date();
  const dateWeekAgo = new Date();
  dateWeekAgo.setDate(currentDate.getDate() - 7);
  currentDate.setDate(dateWeekAgo.getDate());

  const weekDates = Array.from(Array(7)).map(() => {
    currentDate.setDate(currentDate.getDate() + 1);
    return new Date(currentDate);
  });

  return weekDates;
}

export function findDatesIndex(entry: any, weekDates: Date[]) {
  const { createdAt } = entry;
  const entryDate = new Date(createdAt);
  const date = entryDate.getDate();
  const month = entryDate.getMonth();
  const year = entryDate.getFullYear();

  const index = weekDates.findIndex((weekDate) => {
    return (
      weekDate.getDate() === date &&
      weekDate.getMonth() === month &&
      weekDate.getFullYear() === year
    );
  });

  return index;
}
