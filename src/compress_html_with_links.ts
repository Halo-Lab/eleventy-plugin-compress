import { rip } from './rip';
import { read } from './read';
import { gzip } from './gzip';
import { write } from './write';
import { brotli } from './brotli';
import { deflate } from './deflate';
import { makeDirectories } from './mkdir';
import { CompressAlgorithm } from './types';
import { done, oops, start } from './pretty';
import {
  PLUGIN_NAME,
  SCRIPTS_LINK_REGEXP,
  STYLESHEET_LINK_REGEXP,
} from './constants';

const COMPRESSOR_FUNCTIONS = {
  gzip,
  brotli,
  deflate,
} as const;

/**
 * Perform compression of HTML file, styles
 * and scripts that are referenced by this HTML.
 */
export const compressHTMLWithLinks = async (
  content: string,
  outputPath: string,
  algorithm: CompressAlgorithm | ReadonlyArray<CompressAlgorithm>,
  buildDirectory: string
) => {
  const normalizeAlgorithms =
    typeof algorithm === 'string' ? [algorithm] : algorithm;

  const contents = [Promise.resolve({ data: content, url: outputPath })]
    .concat(
      rip(content, STYLESHEET_LINK_REGEXP).map((link) =>
        read(buildDirectory, link)
      )
    )
    .concat(
      rip(content, SCRIPTS_LINK_REGEXP).map((link) =>
        read(buildDirectory, link)
      )
    );

  await Promise.all(
    normalizeAlgorithms.map((compressAlgorithmName) => {
      const compressor = COMPRESSOR_FUNCTIONS[compressAlgorithmName];

      return Promise.all(
        contents.map((info) =>
          info.then(({ data, url }) => {
            start(PLUGIN_NAME, `Start to compress "${url}" file`);

            makeDirectories(url)
              .then(() => compressor(data, url))
              .then(write)
              .then(
                () =>
                  done(
                    PLUGIN_NAME,
                    `"${url}" file was successfully compressed and written to disk`
                  ),
                (error) => oops(PLUGIN_NAME, error)
              );
          })
        )
      );
    })
  );
};
