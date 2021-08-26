import eachDefinitions from './eachDefinitions';

export default function parametersBody(definitions: any = {}, request: { parameters?: any[] } = {}) {
  const { parameters } = request;
  if (!parameters || !Array.isArray(parameters)) return null;
  const body = {};

  if (parameters.length === 1 && parameters[0].in === 'body') {
    const value: any = eachDefinitions({
      definitions,
      ref: parameters[0].schema.$ref
    });
    Object.assign(body, value);
    return body;
  }

  const filter = parameters.filter((item) => item.in !== 'header');

  if (filter.length === 1 && filter[0].schema && filter[0].schema.$ref) {
    // 说明是一个VO对象，只取里面的结构
    const value: any = eachDefinitions({
      definitions,
      ref: filter[0].schema.$ref
    });
    Object.assign(body, value);
    return body;
  }

  filter.forEach((item) => {
    if (item.schema && item.schema.$ref) {
      const value: any = eachDefinitions({
        definitions,
        ref: item.schema.$ref
      });

      body[item.name] = value;
    } else {
      body[item.name] = item;
    }
  });
  return body;
}
