# rest-in-model

model based REST consumer library.

## Installing

`npm install rest-in-model`

## Usage
### Imports
``` javascript
// full import
import RestInModel from 'rest-in-model';

// or you can import by destructuring
import { RestClient, RestBaseModel, settings } from 'rest-in-model';
```
### Settings
##### Endpoint configuration
``` javascript
// Add single endpoint
settings.addEndpoint({ name: 'project', value: 'https://jsonplaceholder.typicode.com/' });
// Add multiple endpoint. And in this case can be only one default endpoint, otherwise throw error
settings.addEndpoint([
  {
    name: 'api',
    value: 'https://jsonplaceholder.typicode.com/',
    default: true,
  },
  {
    name: 'projects',
    value: 'https://jsonplaceholder.typicode.com/projects',
  },
]);

// set default endpoint uses that cases: if either not given default endpoint or desired to change default endpoint
settings.setDefaultEndpoint('api');
```
##### Api Paths configurations
``` javascript
// Add single api path
settings.addApiPath({ name: 'auth', value: '/auth' });
settings.addApiPath({ name: 'api', value: '/serve' });
// Add multiple api path. And in this case can be only one default api path, otherwise throw error
// true
settings.addApiPath([
  {
    name: 'auth',
    value: '/auth',
    default: true,
  },
  {
    name: 'api',
    value: '/serve',
  },
]);
// false
settings.addApiPath([
  {
    name: 'auth',
    value: '/auth',
    default: true,
  },
  {
    name: 'api',
    value: '/serve',
    default: true, // Not Correct
  },
]);
// set default api path uses that cases: if either not given default api path or desired to change default api path
settings.setDefaultApiPath('api');
```

##### Set constant header configuration for each requests
``` javascript
// set common headers for all models with setHeader method of settings
settings.setHeader('Authorization', 'JWT xxxxxxxxxxxxxxxxxxxx...');
```

> You can add additional model-specific headers to each model in `getConfig` method while defining model config. See `User` model definition below: 

### Model Definition

**User** model:

``` javascript
import { RestBaseModel } from 'rest-in-model';

class User extends RestBaseModel {
  getConfig() {
    return {
      // you can add additional headers
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      fields: {
        id: { primary: true },
        name: {},
        username: { /*map: 'user_name'*/ },
        email: {},
        company: {},
        phone: { /*default: null*/ },
        website: {},
        address: {}
      }

      // Normally you don't need to do this. But sometimes back-end doesn't/can't give what you want... 
      // You can get any child from response as result list to convert if you need.
      resultListField: (response) => response.result.contents,

      paths: {
        default: 'users',
        posts: 'users/{userId}/posts'
      },

      //endpointName: '',
      //apiPathName: '',
    };
  }
}

module.exports = User;
```

**Post** model:

``` javascript
import { RestBaseModel } from 'rest-in-model';

class Post extends RestBaseModel {
  getConfig() {
    return {
      fields: {
        id: { primary: true },
        title: {},
        body: {},
        userId: {}
      },

      paths: {
        default: 'posts',
        userPosts: 'users/{userId}/posts'
      },

      //endpointName: '',
      //apiPathName: '',
    }
  }
}

module.exports = Post;
```

### Methods

```javascript
import User from '{model_folder}/user';

const userInstance = new User();

// all returns Promise
userInstance.save(options);
User.save(options);

userInstance.delete(options);
User.delete(options);

User.get(options);
User.all(options);
```

### Detailed Explanation

**userInstance.save(options);**

`options: { path, patch }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|patch(optional)|array of model fields that need to be updated with patch request|`string[]`|-|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

```javascript
userInstance.save(); // userInstance.id === undefined
// XHR finished loading: POST "https://jsonplaceholder.typicode.com/users"

userInstance.save(); // userInstance.id !== undefined
// XHR finished loading: PUT "https://jsonplaceholder.typicode.com/users/(:userId)"

userInstance.save({ patch: ['name', 'lastname'] }); // userInstance.id !== undefined
// XHR finished loading: PATCH "https://jsonplaceholder.typicode.com/users/(:userId)"
```

---
**User.save(options);**

`options: { model, path, patch }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|model(required)|instance of Model extended from RestBaseModel|`instance of RestBaseModel`|-|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|patch(optional)|array of model fields that need to be updated with patch request|`string[]`|-|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

``` javascript
const userInstance = new User({
  name: 'engin üstün',
  username: 'enginustun',
  email: 'enginustun@outlook.com',
  company: '-',
  phone: '-',
  website: '-',
  address: '-'
});

User.save({ model: userInstance }).then((response) => {
  // response is original server response
  // userInstance.id === id of saved record
});
// XHR finished loading: POST "https://jsonplaceholder.typicode.com/users"
```

---
**userInstance.delete(options);**

`options: { path }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

``` javascript
userInstance.delete(); // userInstance.id !== undefined
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/(:userId)"

userInstance.delete({ id: 4 }); // userInstance.id doesn't matter
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/4"
```

---
**User.delete(options);**

`options: { id, path }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|id(required)|required id parameter of model will be deleted. if it is not provided, there will be an error thrown|`number\|string`|-|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

``` javascript
User.delete(); // throws an error

User.delete({ id: 4 });
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/4"
```

---
**User.get(options);**

`options: { id, path, pathData, queryParams }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|id(required)|required id parameter of model will be requested from server. if it is not provided, there will be an error thrown|`number\|string`|-|
|resultField(optional)|**Better to define as config in model class for related field(s)** <br/><br/> for string: if the response is an object, result will be converted based on this name from the response. if this property is not provided or 'response[resultField]' is a falsy value, the response will be assumed as model itself and result will be converted from the response directly. <br /> <br /> for function: you can return any of child/sub-child of given response object.|`string\|(response) => response.what.you.need`|-|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|pathData(optional)|object that contains values of variables in path specified|`object`|-|
|queryParams(optional)|object that contains keys and values of query parameters|`object`|-|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

``` javascript
User.get(); // throws an error

User.get({ id: 2 }).then(({ model, response }) => {
  // 'model' parameter is an instance of User that automatically converted from the server's response.
  // 'response' parameter is original response which is coming from server.
});
// XHR finished loading: GET "https://jsonplaceholder.typicode.com/users/2"

// see User.all() function for usage of pathData property.
```

---
**User.all(options);**

`options: { resultList, resultListField, resultListItemType, path, pathData, queryParams }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|resultList(optional)|array object that will be filled models into it|`[]` reference|-|
|resultListField(optional)|**Better to define as config in model class for related field(s)** <br/><br/> for string: if the response is an object, result list will be converted based on this name from the response. if this property is not provided or 'response[resultListField]' is not an array, the response will be assumed as model list itself and result will be converted from the response directly. <br /> <br /> for function: you can return any of child/sub-child of given response object.|`string\|(response) => response.what.you.need`|-|
|resultListItemType(optional)|it needs to be provided if the result type is different from class type itself.|a model class that is inherited from 'RestBaseModel'|itself|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|pathData(optional)|object that contains values of variables in path specified|`object`|-|
|queryParams(optional)|object that contains keys and values of query parameters|`object`|-|
|generateOnly(optional)|if you want to generate only request url, use this property|`boolean`|`false`|

``` javascript
User.all().then(({ resultList, response }) => {
  // 'resultList' parameter is array of model which is converted from response
  // 'response' parameter  is original server response
});
// XHR finished loading: GET "https://jsonplaceholder.typicode.com/users"

// recommended usage is above
var list = [];
User.all({ resultList: list }).then(() => {
  // 'list' array will be filled with models which are received from server's response.
});
// XHR finished loading: GET "https://jsonplaceholder.typicode.com/users"

// path, pathData and resultListItemType usage
User.all({ path: 'posts', pathData: { userId: 2 }, resultListItemType: Post }).then(({ resultList, response }) => {
  // 'resultList' parameter is an array of Post instances which belongs to user which has id=2.
});
// XHR finished loading: GET "https://jsonplaceholder.typicode.com/users/2/posts"
// it works properly but this way is not recommended.

// best practice of this usage is below
Post.all({ path: 'userPosts', pathData: { userId: 2 } }).then(({ resultList, response }) => {
  // 'resultList' parameter is an array of Post instances which belongs to user which has id=2.
});
// sends same request as above
// XHR finished loading: GET "https://jsonplaceholder.typicode.com/users/2/posts"
```
