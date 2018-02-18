# rest-in-model

model based REST consumer library.

## Installing

`npm install rest-in-model`

## Usage

``` javascript
// full import
import RestInModel from 'rest-in-model';

// or you can import by destructuring
import { RestClient, RestBaseModel, settings } from 'rest-in-model';

// setting it up
settings.addEndpoint({ name: 'project', value: 'https://jsonplaceholder.typicode.com/' });
settings.setDefaultEndpoint('project');

// set additional headers with setHeader method of RestBaseModel
RestBaseModel.setHeader('Authorization', 'JWT xxxxxxxxxxxxxxxxxxxx...');

// settings.addApiPath({ name: 'auth', value: '/auth' });
// settings.addApiPath({ name: 'api', value: '/serve' });
// settings.setDefaultApiPath('api');
```

### Model Definition

**User** model:

``` javascript
import { RestBaseModel } from 'rest-in-model';

class User extends RestBaseModel { }

User.setConfig('idField', 'id');
User.setConfig('fields', {
  id: {},
  name: {},
  username: { /*map: 'user_name'*/ },
  email: {},
  company: {},
  phone: { /*default: null*/ },
  website: {},
  address: {}
});
User.setConfig('paths', {
  default: 'users',
  posts: 'users/{userId}/posts'
});
// User.setConfig('endpointName', '');
// User.setConfig('apiPathName', '');

module.exports = User;
```

**Post** model:

``` javascript
import { RestBaseModel } from 'rest-in-model';

class Post extends RestBaseModel { }

Post.setConfig('idField', 'id');
Post.setConfig('fields', {
  id: {},
  title: {},
  body: {},
  userId: {}
});
Post.setConfig('paths', {
  default: 'posts',
  userPosts: 'users/{userId}/posts'
});
// Post.setConfig('endpointName', '');
// Post.setConfig('apiPathName', '');

module.exports = Post;
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

**userInstance.save(options);**

`options: { endpointName, apiPathName, path, patch }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|patch(optional)|array of model fields that need to be updated with patch request|`string[]`|-|

```javascript
userInstance.save(); // userInstance.id === undefined
// XHR finished loading: POST "https://jsonplaceholder.typicode.com/users"

userInstance.save(); // userInstance.id !== undefined
// XHR finished loading: PUT "https://jsonplaceholder.typicode.com/users/(:userId)"

userInstance.save({ patch: ['name', 'lastname'] }); // userInstance.id !== undefined
// XHR finished loading: PATCH "https://jsonplaceholder.typicode.com/users/(:userId)"
```

---
**userInstance.delete(options);**

`options: { id, endpointName, apiPathName, path }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|id(optional)|optional id parameter of model will be deleted. if it is not provided, it will be got from model|`number\|string`|-|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|

``` javascript
userInstance.delete(); // userInstance.id !== undefined
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/(:userId)"

userInstance.delete({ id: 4 }); // userInstance.id doesn't matter
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/4"
```

---
**User.save(options);**

`options: { model, endpointName, apiPathName, path, patch }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|model(required)|instance of Model extended from RestBaseModel|`instance of RestBaseModel`|-|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|patch(optional)|array of model fields that need to be updated with patch request|`string[]`|-|

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
**User.delete(options);**

`options: { id, endpointName, apiPathName, path }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|id(required)|required id parameter of model will be deleted. if it is not provided, there will be an error thrown|`number\|string`|-|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|

``` javascript
User.delete(); // throws an error

User.delete({ id: 4 });
// XHR finished loading: DELETE "https://jsonplaceholder.typicode.com/users/4"
```

---
**User.get(options);**

`options: { id, endpointName, apiPathName, path, pathData }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|id(required)|required id parameter of model will be requested from server. if it is not provided, there will be an error thrown|`number\|string`|-|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|pathData(optional)|object that contains values of variables in path specified|`object`|-|

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

`options: { resultList, resultListField, resultListItemType, endpointName, apiPathName, path, pathData, queryParams }`

|Property|Description|Type|Default Value|
|--------|-----------|----|--------|
|resultList(optional)|array object that will be filled models into it|`[]` reference|-|
|resultListField(optional)|if the response is an object, result list will be converted based on this name from the response. if this property is not provided or 'response[resultListField]' is not an array, the response will be assumed as model list itself and result will be converted from the response directly.|`string`|-|
|resultListItemType(optional)|it needs to be provided if the result type is different from class type itself.|a model class that is inherited from 'RestBaseModel'|itself|
|endpointName(optional)|one of the endpoint attribute name added to settings|`string`|default|
|apiPathName(optional)|one of the apiPath attribute name added to settings|`string`|default|
|path(optional)|one of the path attribute name in paths object defined in model|`string`|default|
|pathData(optional)|object that contains values of variables in path specified|`object`|-|
|queryParams(optional)|object that contains keys and values of query parameters|`object`|-|

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