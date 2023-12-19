/**
 * Scroll to anchor
 *
 * @param {string} location Element id
 * @param {string} wait     Wait time in milliseconds
 */
export function scrollToAnchor(location: string, wait: number): void {
  const element = document.querySelector("[name='" + location + "']");
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, wait);
  }
}
