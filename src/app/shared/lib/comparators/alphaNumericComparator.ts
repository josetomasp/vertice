export function alphaNumericComparator(
  item1: string,
  item2: string,
  ascending: boolean
): number {
  item1 = item1 + '';
  item2 = item2 + '';
  item1 = item1 + '';
  item2 = item2 + '';
  // Changing from String.localeCompare because it doesn't work properly for some strings
  //  You can see this from running the below statements:
  // console.log('55C956508A'.localeCompare('002516SIG', 'en', { numeric: true })); // compares correctly
  // console.log('55C956508A'.localeCompare('00VA2536100', 'en', { numeric: true })); // doesn't compare correctly
  // console.log('55C956508A' < '002516SIG'); // compares correctly
  // console.log('55C956508A' < '00VA2536100'); // compares correctly
  let returnValue;

  if (item1 === item2) {
    returnValue = 0;
  } else if (item1 > item2) {
    returnValue = 1;
  } else {
    returnValue = -1;
  }

  if (ascending) {
    return returnValue;
  } else {
    return returnValue * -1;
  }
}
