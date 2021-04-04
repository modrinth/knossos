import {
  DEFAULT_OPTIONS,
  GPT_LIB_SCRIPT_ID,
  GPT_INIT_SCRIPT_ID,
} from './constants';

const { resolve } = require('path');

module.exports = async function module(moduleOptions) {
  const options = Object.assign(DEFAULT_OPTIONS, this.options.gptAds, moduleOptions);

  const templatesOptions = {
    ...options,
    GPT_LIB_SCRIPT_ID,
    GPT_INIT_SCRIPT_ID,
  };

  this.addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: 'gpt-ads-module/plugin.js',
    options: templatesOptions,
  });

  this.addTemplate({
    src: resolve(__dirname, 'templates/component.js'),
    fileName: 'gpt-ads-module/component.js',
    options: templatesOptions,
  });
};
module.exports.meta = require('../package.json');
