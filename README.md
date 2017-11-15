# React Uniform Builder

A react component to dynamically build reusable forms. [See the demo here](https://noahprince22.github.io/react-easel/public/)

## Acknowledgements

React Uniform Builder is built on top of [uniforms](https://github.com/vazco/uniforms) and [simple-schema](https://github.com/aldeed/node-simple-schema) with styling inspiration from 
[formBuilder](git@github.com:kevinchappell/formBuilder.git)

This project is maintained by [Amdirent, Inc.](https://amdirent.com) If you'd like to build forms that hook up to arbitrary processes, and a dynamically created database table, check out [Amdirent Opslab](opslab.amdirent.com)

# Usage

## Installing

````
npm install --save react-easel
````
or
````
yarn add react-easel
````

## Quick Start

First, ensure you have loaded bootstrap4 css. This library can be used with custom components and custom styling, but defaults exist for bootstrap.


```javascript
import Easel, { defaults } from 'react-easel';

<Easel onSchemaChange={console.log} {...defaults.bootstrap4} />
```

Using `onSchemaChange`, you can extract a json defintion of a SimpleSchema, which can then be used to render the form like so:

````javascript
import AutoFields from 'uniforms-bootstrap4';
import { defaults } from 'react-easel';
import SimpleSchema from 'node-simpl-schema';

const AutoForm = defaults.bootstrap4.AutoForm;
const AutoField = defaults.bootstrap4.AutoField;

const jsonSchemaDef = <your json definition of a SimpleSchema>

<AutoForm model={{}} schema={new SimpleSchema(jsonSchemaDef)} onSubmit={console.log}>
  <AutoFields autoField={AutoField} />
</AutoForm>
````

*Note:* `onSchemaChange` exists to get data out. It should not be used to drive `Easel` like a normal controlled component. `Easel` will populate initial values with `props.schema`, but it does not update on `componentWillReceiveProps`. This is because the process of creating `Easel`'s interanal state from a schema is slow, but `onSchemaChange` is called every time a component is rearanged. Using this like a normal controlled component leads to a laggy drag and drop experience.
  
## Defining Your Own Components/Inputs

Defaults exist for bootstrap4. You can see those in `src/bootstrap4/defaults`

The easel component expects five props:

| Argument | Description |
| -------- | ---------- |
| `AutoForm` | A uniforms AutoForm. Can import directly from your uniforms package of choice, or use a custom form |
| `components` | A list of component definitions that will appear in the sidebar to be used on the form builder |
| `AutoField` | A uniforms [AutoField](https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#example-customautofield) component capable of rendering all the specified `components`. This will receive a prop `componentType`, which you can use to decide which component to render. |
| `onSchemaChange` | A callback function that will receive a json representation of the SimpleSchema when the component changes. This SimpleSchema can be used to render future forms.  
| `schema` | (optional) A json representation of an existing SimpleSchema to render. 

### Component Definiton

Components are defined as follows:

| Argument | Type | Description|
| -------- | ---- | ---------- |
| `type`   | `string` | A unique identifier for the component. Ex: 'Text Field' |
| `dataType` | `Javascript Primitive` | Corresponds to the `type` field for the object in [node-simple-schema](https://github.com/aldeed/node-simple-schema) |
| `sidebar` | `object` | The definition for what will show in the sidebar|
| `sidebar.text` | `string` | The text that shows up on the sidebar. Ex: 'Text Field'
| `sidebar.icon` | `React Component` | The icon that shows up in the sidebar. Ex: `<i className="fa fa-pencil" />` |
| `admin` | `object` | Definition of any additional configuration the field has. Defaults include `name`, `placeholder`, `label`, `optional`, and `value`|
| `admin.schema` | `SimpleSchema` | A Simple Schema definition to render configuration fields for this Component. Whatever is filled into these fields will be passed as a prop to the component |  

#### Example: Using react-select instead of a regular select

First, make a uniforms driven react-select component:

```javascript
import React from 'react';
import connectField from 'uniforms/connectField';
import UnconnectedReactSelect from 'react-select';
import wrapField from 'uniforms-bootstrap4/wrapField';

const ReactSelect = connectField((props) => wrapField(props,
  <UnconnectedReactSelect {...props} onChange={e => props.onChange(e ? e.value : null)} />
));

export default ReactSelect;
```

Now, override the Select field in the bootstrap defaults with your custom select field:

```javascript
import Easel, { defaults } from 'react-easel';
import ReactSelect from './ReactSelectUniforms';

const myDefaults = { ...defaults.bootstrap4 };
myDefaults.components = defaults.bootstrap4.map(component => {
  if (component.type === 'Select') {
    return {
      ...component,
      formElement: ReactSelect
    }
  }
  
  return component;
});

<Easel onSchemaChange={console.log} {...myDefaults} />
```

#### Example: Adding a WYSIWYG editor

For this example, we're going to use `Trumbowyg`.

First, make the Uniforms driven component:

```javascript
import React from 'react';
import $ from 'jquery';
import wrapField from 'uniforms-bootstrap4/wrapField';
import connectField from 'uniforms/connectField';
import 'react-trumbowyg/dist/trumbowyg.min.css'

global.$ = global.jQuery = window.$ = window.jQuery = $;

const Trumbowyg = require('react-trumbowyg').default;

let id = 0;

// Made to only load the first value passed, that way trumbo can do its thing.
class MyTrumboWyg extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.value
    }
  }

  render() {
    const props = this.props;

    return <Trumbowyg
      id={"react-trumbowyg" + (++id)}
      placeholder={props.placeholder}
      data={this.state.value}
      onChange={(e) => {
        props.onChange($(e.target).trumbowyg('html'));
      }}
    />
  }
}

export default connectField(props => wrapField(props,
  <MyTrumboWyg {...props} />
));
```

Now, create your easel:

```javascript
import BaseField from 'uniforms-bootstrap4/AutoField';
import Easel, { defaults } from 'react-easel';
import MyTrumboWyg from './MyTrumboWyg';

// A custom auto field capable of using `componentType` to decide to render the WYSIWYG
class CustomAuto extends BaseField {
  getChildContextName() {
    return this.context.uniforms.name;
  }

  render() {
    const props = this.getFieldProps(undefined, {ensureValue: false});
    if (props.componentType === 'WYSIWYG') {
      return <MyTrumboWyg {...props} />
    }

    return <defaults.bootstrap4.AutoField {...this.props} />;
  }
}

const WYSIWYGComponent = {
  type: 'WYSIWYG Editor',
  dataType: String,
  sidebar: {
    icon: <i className="fa fa-file-text-o"/>,
    text: 'WYSIWYG Editor'
  },
}

<Easel
  AutoForm={defaults.bootstrap4.AutoForm}
  AutoField={CustomAuto}
  components={defaults.bootstrap4.components.concat([WYSIWYGComponent])}
/>
```

#### Example: Text Area with admin configuration.

Uniforms-bootstrap4 gives us a LongTextField, and that LongTextField can take `rows` as a prop. We'd like to show that in the admin section of the field in Easel.

This example will just show the component configuration, since this already exists in `defaults.bootstrap4`

```javascript
import LongTextField from 'uniforms-bootstrap4/LongTextField';

const LongTextFieldComponent = {
                                 type: 'Textarea',
                                 dataType: String,
                                 sidebar: {
                                   icon: <i className="fa fa-pencil-square-o" />,
                                   text: 'Textarea'
                                 },
                                 defaultProps: {
                                   rows: 10
                                 },
                                 admin: {
                                   schema: new SimpleSchema({
                                     rows: {
                                       type: Number
                                     },
                                   })
                                 }
                               }
```
