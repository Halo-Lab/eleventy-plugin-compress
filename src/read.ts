import { promises } from 'fs';
import { resolve, join } from 'path';

import { oops } from './pretty';
import { RawContentInfo } from './types';

/** Read file from _build_ directory */
export const read = async (
  buildDirectory: string,
  url: string
): Promise<RawContentInfo> => ({
  data: await promises
    .readFile(resolve(buildDirectory, url), {
      encoding: 'utf-8',
    })
    .catch((error) => (oops(error), '')),
  url: join(buildDirectory, url),
});
