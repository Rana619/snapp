export function formatDate(dateInput: Date | string, format: string = "YYYY-MM-DD hh:mm a"): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = date.getHours();
  const isPM = hours >= 12;
  const tokens: Record<string, string | number> = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    hh: pad(((hours + 11) % 12) + 1), // 12-hour format
    HH: pad(hours), // 24-hour format
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    a: isPM ? 'PM' : 'AM',
  };
  return format.replace(/YYYY|MM|DD|hh|HH|mm|ss|a/g, (token) => tokens[token]?.toString() || token);
}