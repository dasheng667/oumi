import { useMemo } from 'react';
import { createId, arrSortByKey } from '@src/utils';

type Tag = { name: string; description: string; id: string };

export default (swaggerData: any) => {
  const swaggerTags: Tag[] = [];
  const { paths } = swaggerData;
  Object.keys(paths).forEach((key) => {
    const value = paths[key];
    const response = value.get || value.post || value.delete || value.put;
    if (response) {
      const { tags } = response;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      Array.isArray(tags) &&
        tags.forEach((k: string) => {
          const find = swaggerTags.some((v) => v.name === k);
          if (!find) {
            swaggerTags.push({ name: k, description: value.summary, id: createId(10) });
          }
        });
    }
  });

  return swaggerTags.sort(arrSortByKey('name')).reverse();
};
