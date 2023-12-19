/**
 * Moves the item in array from position fromIndex to toIndex
 * @param array the array to be updated
 * @param fromIndex the current index of the item to be moved
 * @param toIndex the index of where the item should be moved to
 */
export function arrayMove(array: any[], fromIndex: number, toIndex: number): void {
  let element: any = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, element);
}
