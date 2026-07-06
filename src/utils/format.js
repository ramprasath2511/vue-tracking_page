// core-api returns "Y-m-d H:i:s" (space-separated) rather than ISO-8601,
// which Safari's Date parser rejects — normalise before parsing.
function toParseableDate(value) {
  return value ? new Date(value.replace(' ', 'T')) : null
}

export function formatDate(value) {
  const date = toParseableDate(value)
  if (!date) return null
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(value) {
  const date = toParseableDate(value)
  if (!date) return null
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(value) {
  if (!value) return null
  return `${formatDate(value)} - ${formatTime(value)}`
}
