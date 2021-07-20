import eachDefinitions from './eachDefinitions';

function checkParamsIn(value) {
  if (value && value.in !== 'header') {
    return true;
  }
  return false;
}

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

  parameters.forEach((item) => {
    if (item.schema && item.schema.$ref) {
      const value: any = eachDefinitions({
        definitions,
        ref: item.schema.$ref
      });

      if (checkParamsIn(value)) {
        body[item.name] = value;
      }
    } else if (checkParamsIn(item)) {
      body[item.name] = item;
    }
  });
  return body;
}
