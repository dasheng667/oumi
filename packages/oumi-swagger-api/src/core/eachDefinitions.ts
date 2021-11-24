let refTotal: any;

interface Props {
  definitions: any;
  ref?: string;
  firstFlag?: boolean;
  isArray?: boolean;
  /** ts和json生成的规则有些不同 */
  // isTS?: boolean;
}

export default function eachDefinitions(params: Props) {
  const { definitions = {}, firstFlag = true, isArray } = params || {};
  let { ref } = params;
  const data = {};

  if (firstFlag === true) {
    refTotal = [];
  }

  if (typeof ref !== 'string') return null;

  ref = ref.replace('#/definitions/', '');

  const findRefIndex = refTotal.findIndex((item) => {
    return item.ref === ref;
  });
  if (findRefIndex === -1) {
    refTotal.push({ ref, count: 1 });
  } else {
    if (refTotal[findRefIndex].count >= 3) {
      return {};
    }
    refTotal[findRefIndex].count++;
  }

  if (ref === 'String') {
    return {
      type: 'string'
    };
  }

  if (!definitions[ref]) {
    console.log(`未知的ref: ${ref}`);
    return null;
  }
  const { type, properties = {} } = definitions[ref];

  if (isArray) {
    data['isArray'] = true;
  }

  if (type === 'object') {
    Object.keys(properties).forEach((key) => {
      const childData = properties[key];
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { type } = childData;

      if (childData['$ref']) {
        data[key] = eachDefinitions({ definitions, ref: childData['$ref'], firstFlag: false });
      } else if (childData['items'] && childData['items']['$ref']) {
        data[key] = eachDefinitions({
          definitions,
          ref: childData['items']['$ref'],
          isArray: type === 'array',
          firstFlag: false
        });
      } else if (childData['schema'] && childData['schema']['$ref']) {
        data[key] = eachDefinitions({
          definitions,
          ref: childData['schema']['$ref'],
          isArray: type === 'array',
          firstFlag: false
        });
      } else {
        data[key] = childData;
      }

      // if(childData['$ref']){
      //   data[key] = eachDefinitions({definitions, ref: childData['$ref'], firstFlag: false});
      // }
    });
  }
  return data;
}
