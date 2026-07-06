// core-api returns "Y-m-d H:i:s" in UTC (its app timezone) with no
// timezone marker. Treating that as-is would make the browser interpret it
// as its own local time — appending "Z" tells it this value is really UTC.
function toParseableDate(value) {
  return value ? new Date(value.replace(' ', 'T') + 'Z') : null
}

// Deliveries carry their own local timezone (e.g. "Europe/London") in the
// API response — times should display in that zone, not the viewer's.
export function formatDate(value, timeZone) {
  const date = toParseableDate(value)
  if (!date) return null
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  })
}

export function formatTime(value, timeZone) {
  const date = toParseableDate(value)
  if (!date) return null
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })
}

export function formatDateTime(value, timeZone) {
  if (!value) return null
  return `${formatDate(value, timeZone)} - ${formatTime(value, timeZone)}`
}
