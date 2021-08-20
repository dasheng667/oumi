export const arrSortByKey = function (key: string, order?: 'asc' | 'desc'): any {
  return function (o: any, p: any): number {
    let a: any;
    let b: any;
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      a = o[key];
      b = p[key];
      if (a === b) {
        return 0;
      }
      if (typeof a === typeof b) {
        if (!order || order === 'asc') {
          return a < b ? -1 : 1;
        }
        if (order === 'desc') {
          return a > b ? -1 : 1;
        }
      }
      return typeof a < typeof b ? -1 : 1;
    }
    return 0;
  };
};

export const taskViewGroup = <T>(arr: any) => {
  const group: { [k in string]: T[] } = {};
  arr.forEach((item: any) => {
    const groupName = item.name.substr(0, 1);
    if (!group[groupName]) {
      group[groupName] = [];
    }
    group[groupName].push(item);
  });
  return group;
};
