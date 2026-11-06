import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

export const BUCKET = process.env.S3_BUCKET ?? 'assets';

let instance: Files | null = null;

/**
 * Neon object storage (S3-compatible) scoped to the branch's bucket.
 * Endpoint, region and credentials come from the AWS_* variables that
 * `neon deploy` writes into .env.local.
 */
export function getFiles() {
  if (!instance) {
    instance = new Files({ adapter: neon({ bucket: BUCKET }) });
  }
  return instance;
}
