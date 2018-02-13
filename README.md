# rest-art
model based REST consumer library.

## Installing
`npm install rest-art-model`

## Usage
```javascript
// full import
import RestArt from 'rest-art-model';

// or you can import by destructuring
import { RestArtClient, RestArtBaseModel, settings } from 'rest-art-model';

// setting it up
settings.addEndpoint({ name: 'project', value: 'https://jsonplaceholder.typicode.com/' });
settings.setDefaultEndpoint('project');

settings.addApiPath({ name: 'auth', value: '/auth' });
settings.addApiPath({ name: 'api', value: '/serve' });
settings.setDefaultApiPath('api');
```

### Model Definition

``` javascript
import { RestArtBaseModel } from '../lib/rest-art.js';

class User extends RestArtBaseModel { }

User.setConfig('idField', 'id');
User.setConfig('fields', {
  id: {},
  name: {},
  username: { map: 'user_name' },
  email: {},
  company: {},
  phone: { default: null },
  website: {},
  address: {}
});
User.setConfig('paths', {
  default: 'users',
  entries: 'users/{id}/entries'
});
User.setConfig('endpointName', '');
User.setConfig('apiPathName', '');

module.exports = User;
```

### Methods

```javascript
import User from '{model_folder}/user';

const userInstance = new User();

// all returns Promise
userInstance.save(options);
userInstance.delete(options);

User.save(options);
User.delete(options);

User.get(options);
User.all(options);
```

### Detailed Explanation

**userInstance.save(options);** //options:{ path, apiPathName, endpointName, patch }

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|path|one of the path attribute name in paths object defined in model|`string`|default|
|apiPathName|one of the apiPath attribute name added to settings|`string`|default|
|endpointName|one of the endpoint attribute name added to settings|`string`|default|
|patch|array of model fields that need to be updated with patch request|`string[]`|-|

```javascript
userInstance.save(); // userInstance.id === undefined
//XHR finished loading: POST "http://localhost:3000/serve/users"

userInstance.save(); // userInstance.id !== undefined
//XHR finished loading: PUT "http://localhost:3000/serve/users/(:userId)"

userInstance.save({ patch: ['name', 'lastname'] }); // userInstance.id !== undefined
// XHR finished loading: PATCH "http://localhost:3000/serve/users/(:userId)"
```