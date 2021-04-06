import { promises } from 'fs';
import { resolve, join } from 'path';

import { oops } from './pretty';
import { PLUGIN_NAME } from './constants';
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
    .catch((error) => (oops(PLUGIN_NAME, error), '')),
  url: join(buildDirectory, url),
});
