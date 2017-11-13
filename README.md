# React FormBuilder

A react component to build reusable forms. [See the demo here]()

### Acknowledgements

React Formbuilder is built on top of [uniforms](https://github.com/vazco/uniforms) and [simple-schema](https://github.com/aldeed/node-simple-schema) with styling inspiration from [formBuilder](git@github.com:kevinchappell/formBuilder.git)

This project is maintained by [Amdirent, Inc.](https://amdirent.com) If you'd like to build forms that hook up to arbitrary processes, and a dynamically created database table, check out [Amdirent Opslab](opslab.amdirent.com)

### Usage

#### Installing

````
npm install --save react-formbuilder

or

yarn add react-form-builder
````

#### Quick Start

First, ensure you have loaded bootstrap4 css. This library can be used with completely custom components and custom styling, but defaults exist for bootstrap.


```javascript
import FormBuidler, { defaults } from 'react-formBuilder';

const MyFormBuilder = () => (
  <FormBuilder {...defaults.bootstrap4} />
)
```


