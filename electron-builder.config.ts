import type { Configuration } from 'electron-builder';

const config: Configuration = {
  appId: 'com.focus.timer',
  productName: 'Focus Timer',
  directories: {
    output: 'release'
  },
  files: ['out/**', 'package.json'],
  win: {
    target: 'nsis'
  }
};

export default config;
