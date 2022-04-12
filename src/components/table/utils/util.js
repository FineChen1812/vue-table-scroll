export const getCell = function(event) {
  let cell = event.target;

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell;
    }
    cell = cell.parentNode;
  }
  return null;
};

export function parseWidth(width) {
  if (width) {
    width = parseInt(width, 10);
  } else {
    width = 0;
  }
  return width;
}
