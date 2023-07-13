export function formatDate(
  dateString,
  options = { dateStyle: 'medium', timeStyle: 'short' }
) {
  let formattedDate;
  const date = new Date(dateString);
  formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}
