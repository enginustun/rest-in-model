import RestArtClient from './rest-client';
import helper from '../common/helper';

const restModelToObject = (restModel, type, isSelf) => { console.log(restModel, type); };
const objectToRestModel = (model) => { console.log(model); return model; };

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
    Object.defineProperty(this, 'consumer', {
      value: new RestArtClient({
        endpointName: options.endpointName,
        apiPathName: options.apiPathName,
      }),
    });
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
          consumer.post(this.paths[path], objectToRestModel(this)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = opt.patch[i];
            patchData[key] = this[key];
          }
          consumer.patch(helper.pathJoin(this.paths[path], id), objectToRestModel(patchData)).exec()
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
          consumer.put(helper.pathJoin(this.paths[path], id), objectToRestModel(putData)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }

  get(options) {
    const opt = options || {};
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};
    const id = opt.id || this[this.idField];
    const consumer = this.consumer;
    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          // if there is no pathData.id it should be set
          opt.pathData.id = opt.pathData.id || id;
          let resultPath = this.paths[path];
          if (path === 'default') {
            resultPath = helper.pathJoin(this.paths[path], '{id}');
          }
          // replace url parameters
          resultPath = helper.replaceUrlParamsWithValues(resultPath, opt.pathData);
          consumer.get(resultPath).exec()
            .then((response) => {
              restModelToObject(opt.resultField && response[opt.resultField] ?
                response[opt.resultField] : response, this, true);
              resolve(response);
            })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }

  all(options) {
    const opt = options || {};
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};
    const consumer = this.consumer;
    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        const resultPath = helper.replaceUrlParamsWithValues(this.paths[path], opt.pathData);
        consumer.get(resultPath).exec()
          .then((response) => {
            if (helper.isArray(opt.resultList)) {
              const list = opt.resultListField &&
                helper.isArray(response[opt.resultListField]) ?
                response[opt.resultListField] : response;
              for (let i = 0; i < list.length; i += 1) {
                const item = list[i];
                opt.resultList.push(restModelToObject(
                  item,
                  (opt.resultListItemType instanceof RestArtBaseModel ?
                    opt.resultListItemType : this.constructor),
                ));
              }
            }
            resolve(response);
          })
          .catch((response) => { reject(response); });
      }
    });
  }

  delete(options) {
    const opt = options || {};
    let path = 'default';
    path = opt.path || path;
    const id = opt.id || this[this.idField];
    const consumer = this.consumer;
    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          consumer.delete(helper.pathJoin(this.paths[path], id)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }
}

export default RestArtBaseModel;
