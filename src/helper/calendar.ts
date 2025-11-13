import { GetShiftResponse, GroupedShift } from "@/interfaces/shift";

export function groupByDate(shifts: GetShiftResponse[]): GroupedShift {
  const result: GroupedShift = {};

  shifts.forEach((item) => {
    const date = item.date;

    if (!result[date]) result[date] = [];

    result[date].push({
      doctor: item.doctors.name,
      shift: item.shift,
      created_at: item.created_at,
    });
  });

  Object.keys(result).forEach((date) => {
    result[date].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  });

  return result;
}

export function extractUniqueMonths(data: GetShiftResponse[]) {
  const months = new Set<string>();
  data.forEach((item) => {
    const d = new Date(item.date);
    months.add(`${d.getFullYear()}-${d.getMonth()}`);
  });
  return [...months];
}

export function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function monthName(index: number) {
  return [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ][index];
}

export function toLocalDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
