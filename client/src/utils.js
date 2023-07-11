export function formatDate(
  dateString,
  options = { dateStyle: 'medium', timeStyle: 'short' }
) {
  let formattedDate;
  console.log(dateString);
  const date = new Date(dateString);
  formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}
