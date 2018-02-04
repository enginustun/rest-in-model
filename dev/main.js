import RestArtClient from './modules/rest-client';
import RestArtBaseModel from './modules/base-model';
import settings from './modules/settings';
import helper from './common/helper';

module.exports = {
  RestArtClient,
  RestArtBaseModel,
  SetGlobalSettings(_settings) {
    if (helper.isObject(_settings)) {
      const settingsKeys = Object.keys(_settings);
      for (let i = 0; i < settingsKeys.length; i += 1) {
        const settingKey = settingsKeys[i];
        settings[settingKey] = _settings[settingKey];
      }
    }
  },
};
