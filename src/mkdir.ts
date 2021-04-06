import { dirname, resolve } from 'path';
import { promises, existsSync } from 'fs';

/** Recursively creates directories. */
export const makeDirectories = async (...paths: ReadonlyArray<string>) => {
  const url = resolve(...paths);

  if (!existsSync(url)) {
    await promises.mkdir(dirname(url), { recursive: true });
  }
};
