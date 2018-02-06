import RestArtClient from './rest-client';
import helper from '../common/helper';

const restModelToObject = (restModel, type) => { /*console.log(restModel, type);*/ };
const objectToRestModel = (model) => { /*console.log(model);*/ return model; };

class RestArtBaseModel {
  constructor(options) {
    const opt = options || {};
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${constructor.name}_config`];
    const { fields } = config;

    const fieldKeys = Object.keys(fields);
    // define each field of fields as model's field
    for (let i = 0; i < fieldKeys.length; i += 1) {
      const fieldKey = fieldKeys[i];
      this[fieldKey] = fields[fieldKey] ? fields[fieldKey].default : undefined;
    }

    // define REST consumer
    if (!constructor.consumer) {
      Object.defineProperty(constructor, 'consumer', {
        value: new RestArtClient({
          endpointName: opt.endpointName || config.endpointName,
          apiPathName: opt.apiPathName || config.apiPathName,
        }),
        writable: true,
      });
    }
  }

  static setConfig(name, value) {
    RestArtBaseModel[`${this.name}_config`] = RestArtBaseModel[`${this.name}_config`] || {};
    RestArtBaseModel[`${this.name}_config`][name] = value;
  }

  save(options) {
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const id = this[config.idField];
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        // if there is no id, then post and save it
        if (!id) {
          consumer.post(config.paths[path], objectToRestModel(this)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = opt.patch[i];
            patchData[key] = this[key];
          }
          consumer.patch(
            helper.pathJoin(config.paths[path], id),
            objectToRestModel(patchData),
          ).exec()
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
          delete putData[config.idField];
          consumer.put(
            helper.pathJoin(config.paths[path], id),
            objectToRestModel(putData),
          ).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }

  static save(options) {
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    if (!(opt.model instanceof constructor)) {
      throw Error('model must be provided as option parameter');
    }
    const id = opt.model[config.idField];

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        // if there is no id, then post and save it
        if (!id) {
          consumer.post(config.paths[path], objectToRestModel(opt.model)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = opt.patch[i];
            patchData[key] = opt.model[key];
          }
          consumer.patch(
            helper.pathJoin(config.paths[path], id),
            objectToRestModel(patchData),
          ).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          // otherwise put all fields
          const putData = {};
          const fieldKeys = Object.keys(opt.model);
          for (let i = 0; i < fieldKeys.length; i += 1) {
            const key = fieldKeys[i];
            putData[key] = opt.model[key];
          }
          delete putData[config.idField];
          consumer.put(
            helper.pathJoin(config.paths[path], id),
            objectToRestModel(putData),
          ).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }

  static get(options) {
    const constructor = this.constructor;
    const opt = options || {};
    const config = RestArtBaseModel[`${this.name}_config`];
    const id = opt.id || this[config.idField];
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          // if there is no pathData.id it should be set
          opt.pathData.id = opt.pathData.id || id;
          let resultPath = config.paths[path];
          if (path === 'default') {
            resultPath = helper.pathJoin(config.paths[path], '{id}');
          }
          // replace url parameters
          resultPath = helper.replaceUrlParamsWithValues(resultPath, opt.pathData);
          consumer.get(resultPath).exec()
            .then((response) => {
              restModelToObject(opt.resultField && response[opt.resultField] ?
                response[opt.resultField] : response, constructor);
              resolve(response);
            })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }

  static all(options) {
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        const resultPath = helper.replaceUrlParamsWithValues(config.paths[path], opt.pathData);
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
                    opt.resultListItemType : constructor),
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
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const id = opt.id || this[config.idField];
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          consumer.delete(helper.pathJoin(config.paths[path], id)).exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }

  static delete(options) {
    const constructor = this.constructor;
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const { id } = opt;
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          consumer.delete(helper.pathJoin(config.paths[path], id)).exec()
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
