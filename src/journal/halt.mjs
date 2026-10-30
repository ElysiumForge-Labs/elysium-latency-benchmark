import fs from 'node:fs/promises';
import path from 'node:path';

export async function assertHalted(config) {
  try {
    await fs.access(path.join(config.stateDir, 'HALT'));
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
