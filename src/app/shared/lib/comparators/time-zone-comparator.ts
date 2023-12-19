const ATLANTIC: string = 'AST';
const ALASKA: string = 'AKST';
const MOUNTAIN: string = 'MST';
const HAWAII: string = 'HAST';
const CENTRAL: string = 'CST';
const PACIFIC: string = 'PST';
const EASTERN: string = 'EST';

function atlanticCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
      return 0;
    case EASTERN:
    case CENTRAL:
    case MOUNTAIN:
    case PACIFIC:
    case ALASKA:
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function easternCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
      return -1;
    case EASTERN:
      return 0;
    case CENTRAL:
    case MOUNTAIN:
    case PACIFIC:
    case ALASKA:
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function centralCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
    case EASTERN:
      return -1;
    case CENTRAL:
      return 0;
    case MOUNTAIN:
    case PACIFIC:
    case ALASKA:
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function mountainCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
    case EASTERN:
    case CENTRAL:
      return -1;
    case MOUNTAIN:
      return 0;
    case PACIFIC:
    case ALASKA:
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function pacificCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
    case EASTERN:
    case CENTRAL:
    case MOUNTAIN:
      return -1;
    case PACIFIC:
      return 0;
    case ALASKA:
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function alaskaCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
    case EASTERN:
    case CENTRAL:
    case MOUNTAIN:
    case PACIFIC:
      return -1;
    case ALASKA:
      return 0;
    case HAWAII:
      return 1;

    default:
      return 0;
  }
}

function hawaiiCompare(item2: string) {
  switch (item2) {
    case ATLANTIC:
    case EASTERN:
    case CENTRAL:
    case MOUNTAIN:
    case PACIFIC:
    case ALASKA:
      return -1;
    case HAWAII:
      return 0;

    default:
      return 0;
  }
}

export function timeZoneComparator(
  item1: string,
  item2: string,
  ascending: boolean
): number {
  let returnValue = 0;

  if (null == item1) {
    if (null == item2) {
      returnValue = 0;
    } else {
      returnValue = -1;
    }
  } else {
    if (null == item2) {
      returnValue = 1;
    } else {
      switch (item1) {
        case ATLANTIC:
          returnValue = atlanticCompare(item2);
          break;
        case ALASKA:
          returnValue = alaskaCompare(item2);
          break;
        case MOUNTAIN:
          returnValue = mountainCompare(item2);
          break;
        case HAWAII:
          returnValue = hawaiiCompare(item2);
          break;
        case CENTRAL:
          returnValue = centralCompare(item2);
          break;
        case PACIFIC:
          returnValue = pacificCompare(item2);
          break;
        case EASTERN:
          returnValue = easternCompare(item2);
          break;

        default:
          returnValue = 0;
      }
    }
  }

  if (ascending) {
    return returnValue * -1;
  } else {
    return returnValue;
  }
}



