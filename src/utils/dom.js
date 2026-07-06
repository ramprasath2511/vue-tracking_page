// core-api sometimes returns image URLs the browser can't load directly
// (e.g. private S3 objects) — hide the element rather than show a broken-image icon.
export function hideBrokenImage(event) {
  event.target.style.display = 'none'
}
