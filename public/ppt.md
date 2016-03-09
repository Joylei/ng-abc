class: center, middle

# Intro AngularJS

by leingliu@gmail.com

---

name:agenda

# Agenda

 1.Introduction

 2.Basic Concept

 3.Deep-dive

 4.Tricks

 5.QA

 6.Appendex

---

name: intro
class: center, middle

# Introduction

---

## Front-End Trends

### Module System

AMD

CMD

UMD

--

### Module Loader

RequireJS

SeaJS

SystemJS

---

### NodeJS

- gulp
- less/scss
- browserify
- webpack

transform
minify
combine
browserify
modular

---

### live-reload / hot-module-replacement

Reflect changes on the fly as you save the code


### Compile to JS

Typescript - by Microsoft

Dart - by Google

FlowJS - by Facebook

CoffeeScript

---

### Web Components

The Future

--

### Frameworks

- AngularJS: MVC, Data-binding, by Google
- KnockoutJS: An MVVM framework with better browser compatibility
- VueJS: An angular like framework but more smaller in size
- RiotJS: a react like framework but more smaller than any others and close to standards
- ReactJS: Virtal DOM, FLUX Pattern, by Facebook


### Mobile Development with JS

React Native -  compile native app, by Facebook

Native Script - compile native app

Cordova/PhoneGap - Hybrid framework

--

Ionic Framework - based on AngularJS & PhoneGap

---

### Desktop Development with JS

Electron - by Github, eg Atom, VS Code

Node-Webkit

Open-Webkit-Sharp - C# wrapper of Webkit

--
Example:

Atom, VS Code
有道词典、有道笔记、QQ、豌豆荚

### Backend Development

Alibaba

Tencent

Baidu

---

## AngularJS

![AngularJS](./img/AngularJS-large.png)

[http://angularjs.org](http://angularjs.org)

---

name: why

## Why AngularJS

>HTML is great for declaring static documents, but it falters when we try to use
>it for declaring dynamic views in web-applications. AngularJS lets you extend
>HTML vocabulary for your application. The resulting environment is
>extraordinarily expressive, readable, and quick to develop.

.right[-- from http://angularjs.org]

---
layout: true

# Basic Concept

---

## Bootstrap AngularJS

Hello AngularJS

--

```html
<script src="../../angular.js"></script>

<div ng-app>
    Name: <input type=text ng-model="name" ng-init="name='AngularJS'">
    <br>
    Hello {{name}}
</div>
```

--

use *ng-app* to bootstrap AngularJS.

--

[view this example](./examples/helloworld/)

---

## Model-View-Controller

angular supports the principles behind the Model-View-Controller design pattern.

--

model - Models are the properties of a scope; scopes are attached to the DOM
where scope properties are accessed through bindings.

The *$scope* service is used to inject the model.

--

view - The template (HTML with data bindings) that is rendered into the View.

--

controller - The Controller class contains business logic behind the application
 to decorate the scope with functions and values.

The *ngController* directive attaches a controller class to the view.

---

## Play with Controller

Define a controller

```js
var app = angular.module('app',[]);
app.controller('TodoCtrl', function($scope){
  //more code here
  $scope.msg = 'Hello';
});
```

---

Run with controller

```html
<div ng-app="app">
    <div ng-controller="TodoCtrl">
      {{ msg }}
    </div>
</div>
```

*ng-controller* instantiate the controller

*ng-app="app"*  here app is the module name

--

[View this example](./examples/definecontroller/)

---

## Data Binding

use *{{expr}}* to bind some expression.

Data-binding is an automatic way of updating the view whenever the model changes
, as well as updating the model whenever the view changes.

---

## About *expr*
-  property on $scope, eg {{ msg }} means $scope.msg of current scope or its
   parent scope and etc.
-  method call on $scope, eg {{ say() }} means $scope.say()
-  simple plain object, eg: {{ 'hello' }}
-  combine of above, eg: {{ say(msg || 'hello') }}
-  even more complex, eg: {{ new Date().getTime()%5===1 ? say(msg || 'hello') : ''+msg }}

--

## global variables not allowed

eg: {{ document.location.href }} try to reference document that not in any $scope

---
class: center, middle
layout: false
## Example - Simple Todo

A more complex example

---

## Example - Simple Todo(html part)

```html
<div ng-app="app">
    <div ng-controller="TodoCtrl">
      <h1>Todos:</h1>
      <p>
        <span>Total: {{ todos.length }} </span>
        <span>Done: {{ completedTodos().length }}</span>
      </p>
      <ul class="todos">
        <li ng-repeat="item in todos">
          <span ng-class="{ done:item.done }">{{ item.text }}</span>

          <input type="button" value="Remove" ng-click="removeTodo($index)">
          <input type="button" value="{{ item.done? 'Undo' : 'done' }}"
            ng-click="finishTodo($index)">
        </li>
      </ul>
      <form ng-submit="addTodo()">
        <input type="text" ng-model="todoAdded">
      </form>
    </div>
</div>
```

---

## Example - Simple Todo(js part)

```js
//define module
var app = angular.module('app', []);
//define controller
app.controller('TodoCtrl', function TodoCtrl($scope){
  $scope.todos = [];
  $scope.completedTodos = function(){
    var items = [];
    angular.forEach($scope.todos, function(todo){
      todo.done && items.push(todo);
    });
    return items;
  };
  $scope.finishTodo = function($index){
    var todo = $scope.todos[$index];
    todo.done = !todo.done;
  };
  $scope.removeTodo = function($index){
    $scope.todos.splice($index,1);
  };
  $scope.addTodo = function(){
    var text = $scope.todoAdded;
    if(text){
      $scope.todos.push({ text : text,done: false });
      $scope.todoAdded = '';//clear text
    }
  };
});
```

---

## Example - Simple Todo (run it)

[View this example](./examples/simpletodo/)

--

Compare with jQuery version [View](./examples/jquerytodo/)

---

## Nested Controllers & Scopes

scopes are nested.

[$rootScope](https://docs.angularjs.org/api/ng/type/$rootScope.Scope) - the root
 scope.

--

*$scope.$root* reference to the root scope

```js
app.controller('TodoCtrl', function($scope){
  //you can do something with the $rootscope
  $scope.$root.msg = 'hello';
});
```
--

$scope.$parent - get the parent scope of current scope

--

controllers are also nested.

[View Example](./examples/nestedcontrollers/)

---

# Deep-Dive

Module

Dependency Injection(DI)

Services

Directives

Filters

Form Validation

---

## Module Declaration

Define a module
```js
var app = angular.module('app',[]);
```
--
with dependencies

```js
angular.module('app.controllers',['app.services'])
angular.module('app.directives', []);
angular.module('app.services', []);
angular.module('app.filters', []);
angular.module('app', ['app.controllers','app.directives','app.filters'])
```
---

Reference a defined module

If you've defined a module somewhere, you can reference it by it's name.

```js
var services = angular.module('app.services');

```
---

## DI
When define controller, directive, service, filter, etc.

```js
angular.module('app',[])
.controller('TodoCtrl', function TodoCtrl($scope, $http){
  //more code here
})
```
--
*$scope* and *$http* are known services defined by angular and injected by
angular when creating the instance of controller

---

## DI - Explicit
```js
angular.module('app',[])
.controller('TodoCtrl', ['$scope', '$http', function TodoCtrl($scope, $http){
  //code here
}])
```

dependencies are resolved by name, when minified the code we can still make it
work by this way.

[view example](../../examples/diexplicite/index.html)

---

## DI - Another Way

```js
var app = angular.module('app',[]);
function TodoCtrl($scope, $http){
  $scope.msg = "Explicit injection";
  //more code here
}
TodoCtrl.$inject = ['$scope', '$http'];
app.controller('TodoCtrl', TodoCtrl);
```

[view example](../../examples/diexplicite/inject.html)

---

## Known Services

Service                                                                  | Description
------------------------------------------------------------------------ | -------------
[$http](https://docs.angularjs.org/api/ng/service/$http)                 | Allows promise-based access to HTTP requests.
[$resource](https://docs.angularjs.org/api/ngResource/service/$resource) | Provides a higher-level abstraction for accessing REST-style services
[$window](https://docs.angularjs.org/api/ng/service/$window)             | Is a jQuery (lite)-wrapped reference to window
[$document](https://docs.angularjs.org/api/ng/service/$document)         | Is a jQuery (lite)-wrapped reference to window.document
[$timeout](https://docs.angularjs.org/api/ngMock/service/$timeout)       | This is a wrapped version of window.setTimeout. In tests, you can use $timeout.flush() to synchronously execute all scheduled timeouts.
[$cacheFactory](https://docs.angularjs.org/api/ng/service/$cacheFactory) | Usually used by other services whenever they need a scoped cache of elementes
[$filter](https://docs.angularjs.org/api/ng/service/$filter)             | Provides programmatic access to a filter function
[$log](https://docs.angularjs.org/api/ng/service/$log)                   | Simple service for logging. Default implementation safely writes the message into the browser's console (if present).

---

## Define a service

```js
var app = angular.module('app', []);
app.service('TodoStore', function($http){
  var TODO_URL = '../../todos';
  this.fetch = function(){
    return $http.get(TODO_URL, null, {
      params : {
        t : new Date().getTime()
      }
    }).then(function(res){
      return res.data;
    });
  };

  this.save = function(data){
    return $http.post(TODO_URL, data).then(function(res){
      return res.data;
    });
  };
});
```

---

## Use the service

```js
app.controller('TodoCtrl', function TodoCtrl($scope, TodoStore){
  //more code here
}
```

--

## Example - TODO App with backend

[TODO App with backend](./examples/todowithbackend/)

---

## Directives

At a high level, directives are markers on a DOM element (such as an attribute,
element name, comment or CSS class) that tell AngularJS's HTML compiler
($compile) to attach a specified behavior to that DOM element (e.g. via event
listeners), or even to transform the DOM element and its children.

--

built-in directives start with ng-*

custom directives should have a different prefix.

---

## Define a Directive

simple directive

```js
app.directive('myClickCount', function(){
  return {
    restrict: 'ACE',
    template: '<p>{{ count }}</p>'
  }
});
```

--
*count* is from parent scope

---

## restrict option

*restrict: 'ACE'*

A - as an attribute

```html
<div my-click-count></div>
```

--
C - as a class

```html
<div class="my-click-count"></div>
```

--
E - as an element

```html
<my-click-count></my-click-count>
```

--

[view example](../../examples/simpledirective)

---

# require option

specify dependency of other directives

```js
app.directive('myClickCount', function(){
  return {
    restrict: 'ACE',
    template: '<p>{{ count }}</p>',
    require: '^ngModel'
  }
});
```
--

```html
<div ng-model="count" my-click-count></div>
```

--

[view example](../../examples/directivewithdependency/)

---

Notice, in the require option, we prefixed the controller with a ^. That means
angular looks for ngModel directive on parent elements, not just on the local
scope. Without the prefix, it just search on its own element.


---

## template option

directive with template and new scope

```js
app.directive('myClickCount', function(){
  function link(scope, element, attrs){
    //more code here
  }
  return {
    scope:{},
    template: '<p>{{ count }}</p>',
    link: link
  };
});
```

---

## templateUrl option

template: count-tpl.html

```html
<p>{{ count }}</p>
```

--

```js
app.directive('myClickCount', function(){
  function link(scope, element, attrs){
    //more code here
  }
  return {
    scope:{},
    templateUrl: 'count-tpl.html',
    link: link
  };
});
```

--

[view this example](../../examples/directivewithtemplateurl/)

---

## Inline template

you can inline templates on the page.

```html
<script type="angular/template" id="count-tpl.html">
  <p>{{ count }}</p>
</script>
```

--

When bootstrap angular, it will parse and cache templates.

Thus you can assign *count-tpl.html* to *templateUrl* of a directive.

---

## ng-include to include a template

when you want to reuse a template but no need to define a directive.

```html
<div ng-include="count-tpl.html"></div>
<script type="angular/template" id="count-tpl.html">
  <p>{{ count }}</p>
</script>
```

---

## scope option

*scope:false* default value of scope is false if not specified

*scope:true* defines a new scope which inherits members from parent scope.

--

*scope: {}* create an isolated scope, access parent scope by *$scope.$parent*

---

## isolated scope

isolated scope takes an object/hash which lets you derive properties from the
parent scope and bind them to the local scope. There are three ways to do that:

 -  @ – Local scope property (which always a string).the value will be available
  inside your directive’s scope.

 -  = – Bi-directional binding.If the parent model changes, just like in normal
    data-binding then the local property will reflect the change.

 -  & – Parent execution binding.binds an expression or method which will be
    executed in the context of the scope it belongs.

[view this example](../../examples/isolatedscope/)

---

## link option

*link* function defines how to manipulate the view

[view example](../../examples/directivewithnewscope/)

--

## controller option

*controller* function defines a controller

---

class: center middle

## Filters

--

Filters apply some sort of transform on the data, either formatting or filtering

---

## Known Filters

Filter        | Description
------------- | -------------
date | format date
json | convert object to JSON string
filter | select subset of an array
currency | format a number as currency (eg $1,234.1)

---

## How to use Filters

take date as example

```html
<p> {{ new Date() | date:'yyyy-MM-dd' }} </p>
```

--

data passed in pipe line

*{{ expr | filter}}*

--

filter can be chained

*{{ expr | filter1 | filter2 |... }}*

---

in code

```js
app.controller('TodoCtrl',function($filter){
  var now = new Date();
  var text = $filter('date')(now, 'yyyy-MM-dd');
  console.log(text);
});
```
---

## Define a filter

```js
app.filter('yesno', function(){
  return function(input){
    if(!!input){
      return 'yes';
    }
    return 'no';
  }
});
```

Here we defined a yesno filter and it will test the data to determine 'yes' or 'no';

--
easy to use

```html
<p> {{ 1 | yesno }} </p>
<!-- output is yes -->
```

--

[View Example](../../examples/yesnofilter/)

---

filter with parameters

```js
app.filter('happy',function($http, $timeout){
  return function(input, freeTime, moneyOnHand){
    input = input || {};
    freeTime = freeTime || 0;
    moneyOnHand = moneyOnHand || 0;
    return (input.freeTime && input.freeTime > freeTime)
      && (input.moneyOnHand && input.moneyOnHand > moneyOnHand);
  }
});
```

--

usage

```html
<p ng-init=" person = { name: 'Bob' , freeTime: 5, moneyOnHand: 1000 } ">
  {{ person.name }} is a happy man: {{ person | happy:0:0.5 }}
</p>
```

--

[View Example](../../examples/happyfilter/)

---

##Form Validation

Angular provides basic implementation for most common HTML5 input types: (text,
number, url, email, date, radio, checkbox), as well as some directives for
validation (required, pattern, minlength, maxlength, min, max).

---

```html
<form name="form" class="css-form" novalidate>
  <div>
    Size (integer 0 - 10):
    <input type="number" ng-model="size" name="size"
           min="0" max="10"/>{{size}}<br />
    <span ng-show="form.size.$error.number">
      The value is not a valid number!
    </span>
    <span ng-show="form.size.$error.min || form.size.$error.max">
      The value must be in range 0 to 10!</span>
  </div>

  <div>
    Email:
    <input type="email" ng-model="name" name="name" required />{{name}}<br />
    <span ng-show="form.name.$error.email">Must be email</span>
    <span ng-show="form.name.$error.required">Required</span>
  </div>
</form>
```

[run it](../../examples/formvalidation/)

---

## Form Validation - pattern

```html
<form name="form" class="css-form" novalidate>
  <div>
    Size (integer 0 - 10):
    <input type="number" ng-model="size" name="size"
           min="0" max="10" ng-pattern="/^\d+$/" />{{size}}<br />
    <span ng-show="form.size.$error.pattern">
      The value is not a valid number!
    </span>
    <span ng-show="form.size.$error.min || form.size.$error.max">
      The value must be in range 0 to 10!</span>
  </div>
</form>
```

[run it](../../examples/formvalidationpattern/)

---

An advanced usage

```js
angular.module('app',[])
  .controller('FormCtrl', function($scope){
    $scope.integer = {
      test: function(value){
        //more complex code here
        return /\d+/.test(value);
      }
    };
  });
```

```html
<input type="number" ng-model="size" name="size"
       min="0" max="10" ng-pattern="integer" />
```

[run it](../../examples/formvalidationpattern/advanced.html)

---

## Form Validation - Custom

```js
angular.module('app',[])
  .controller('FormCtrl', function($scope){ })
  .directive('integer', function(){
    function link(scope, element, attrs, ctrl){
      if(ctrl){
        ctrl.$validators.integer = function(value){
          return !value || /^\d*$/.test(value);
        }
      }
    }
    return {
      require: 'ngModel',
      link:link
    }
  });
```

```html
<input type="number" ng-model="size" name="size"
       min="0" max="10" integer />
```

[run it](../../examples/formvalidationcustom/)

---

## Form Validation - more

[more...](https://code.angularjs.org/1.4.8/docs/guide/forms)

---

#Tricks

  - avoid display uncompiled code

  - performance improvement for ng-repeat

  - performance improvement by limit change range

  - angular only trace changes on angular context

---

## avoid display un-compiled code

```html
<style type="text/css">
  [ng-cloak] { display: none; }
</style>

<div ng-controll="..." ng-cloak>
  <!-- more code here -->
</div>

```

--
With *ng-cloak*, the html code will be hidden at the beginning.

After angular bootstrapped, ng-cloak will be removed from the compiled code.

---

## performance improvement for ng-repeat

you can specify a unique id for *ng-repeat*, if not angular will hash the data and use it to track the data.

```html
<li ng-repeat="todo in todos track by id"></li>
```

---

## performance improvement by limit $scope range

DO NOT do all things in one scope. You'd better keep changes in the sub-scope.
This will reduce the range affected by changes.

For example, you can nest controllers.
You can define sub-scope in directives.

---

## angular only trace changes on angular context

$http, $timeout already take care of the changes.

In your own code, you must manually let angular know the changes, otherwise the view will not get updated.

---

```js
app.controller('TodoCtrl', function($scope){
  $scope.time = null;
  setInterval(function(){
    $scope.time = new Date();
  }, 1000);
});
```

--

```html
<p>{{ time }}</p>
```

The above code will not update the view.

---

so how to make it work?

--

```js
app.controller('TodoCtrl', function($scope){
  $scope.time = null;
  setInterval(function(){
    $scope.$evalAsync(function(){
      $scope.time = new Date();
    });
  }, 1000);
});
```

--

*$scope.$evalAsync(fn)* is a safe way to notify changes

*$scope.$digest()* also works,($digest only apply on current scope), but will
get error 'already $digest in progress' if as it saying

*$scope.$apply(fn)* also works, it applies on the root scope (not effective
because it will calculate expressions on all sub scopes), but will get error
'already $digest in progress' if as it saying

---

## Summary of angular context

When you do something on the other context, like ajax, async calls, you have to
trigger $digest on angular context.

---

## QA

---

class: center middle

# The End

---

# More

how to run this ppt?

 - download and install [nodejs](http://nodejs.org)
 - navigate to the root folder of this code
 - then run cmd: *npm install && npm start*
 - open the url in your browser : http://localhost:8080
