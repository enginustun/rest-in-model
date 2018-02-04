import RestArtClient from './rest-client';
import helper from '../common/helper';
import settings from './settings';

class RestArtBaseModel {
  constructor(options) {
    if (!helper.isObject(options)) {
      throw new Error('options must be provided to base model constructor.');
    } else if (!helper.isObject(options.fields)) {
      throw new Error('options.fields must be provided to base model constructor.');
    } else if (!options.idField) {
      throw new Error('options.idField must be provided to base model constructor.');
    } else if (!helper.isObject(options.fields[options.idField])) {
      throw new Error(`options.fields[${options.idField}] must be provided to base model constructor.`);
    } else if (!helper.isObject(options.paths)) {
      throw new Error('options.paths must be provided to base model constructor.');
    } else if (!options.paths.default) {
      throw new Error('options.paths.default must be provided to base model constructor.');
    }

    Object.defineProperty(this, 'fields', { value: options.fields });
    Object.defineProperty(this, 'idField', { value: options.idField });
    Object.defineProperty(this, 'paths', { value: options.paths });
    const fieldKeys = Object.keys(this.fields);
    // define each field of this.fields as model's field
    for (let i = 0; i < fieldKeys.length; i += 1) {
      const fieldKey = fieldKeys[i];
      this[fieldKey] = this.fields[fieldKey] ? this.fields[fieldKey].default : undefined;
    }

    // define REST consumer
    Object.defineProperty(this, 'consumer', { value: new RestArtClient({ endpoint: options.endpoint }) });
  }

  save(options) {
    const opt = options || {};
    let path = 'default';
    path = opt.path || path;
    const id = this[this.idField];
    const consumer = this.consumer;
    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        // if there is no id, then post and save it
        if (!id) {
          consumer.post(this.paths[path], this).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = opt.patch[i];
            patchData[key] = this[key];
          }
          consumer.patch(this.paths[path] + id, patchData).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          // otherwise put all fields
          const putData = {};
          const fieldKeys = Object.keys(this);
          for (let i = 0; i < fieldKeys.length; i += 1) {
            const key = fieldKeys[i];
            putData[key] = this[key];
          }
          delete putData[this.idField];
          consumer.put(this.paths[path] + id, putData).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }
  // get() { }
  // all() { }
  // delete() { }
}

export default RestArtBaseModel;
