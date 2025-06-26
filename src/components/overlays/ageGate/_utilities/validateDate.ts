export function validateDate(
  year: number,
  month: number,
  day: number
): boolean {
  month = month - 1;
  const currentYear = new Date().getFullYear();
  const d = new Date(year, month, day);
  if (year > currentYear || year < 1900) return false;
  if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
    return true;
  }
  return false;
}
