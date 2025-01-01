import { dirname, join } from 'path';

const entryPointDirectory = dirname(require.main!.filename);

const mainDirectory = join(entryPointDirectory, '..');

export { mainDirectory, entryPointDirectory };
