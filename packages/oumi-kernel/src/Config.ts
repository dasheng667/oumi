import { existsSync } from 'fs';
import { join } from 'path';
import { winPath, getModuleExport } from '@oumi/cli-shared-utils';

interface Options {
  appPath: string;
  configFiles?: string[];
}

const DEFAULT_CONFIG_FILES = ['.oumi.config.ts', '.oumi.config.js', 'config/config.ts', 'config/config.js'];

export default class Config {
  appPath: string;

  configFiles = DEFAULT_CONFIG_FILES;

  initialConfig: any;

  constructor(opts: Options) {
    this.appPath = opts.appPath || process.cwd();

    if (Array.isArray(opts.configFiles)) {
      this.configFiles = Array.from(new Set([...this.configFiles, ...opts.configFiles]));
    }

    this.initialConfig = this.getUserConfig();
  }

  getConfigFile(): string | null {
    const configFile = this.configFiles.find((f) => existsSync(join(this.appPath, f)));
    return configFile ? winPath(configFile) : null;
  }

  getUserConfig() {
    const file = this.getConfigFile();
    if (file) {
      return getModuleExport(require(join(this.appPath, file)));
    }
    return {};
  }
}
