# rest-art
model based REST consumer library.

## Installing
`npm install rest-art-model`

## Usage
```javascript
// full import
import RestArt from 'rest-art-model';

// or you can import by destructing
import { RestArtClient, RestArtBaseModel, settings } from 'rest-art-model';

// setting it up
settings.addEndpoint({ name: 'project', value: 'https://jsonplaceholder.typicode.com/' });
settings.setDefaultEndpoint('project');
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