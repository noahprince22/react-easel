import React from 'react';
import LongTextField from 'uniforms-bootstrap4/LongTextField';
import TextField from 'uniforms-bootstrap4/TextField';
import AutoField from 'uniforms-bootstrap4/AutoField';
import SelectField from 'uniforms-bootstrap4/SelectField';
import NumberField from 'uniforms-bootstrap4/NumField';
import RadioGroup from 'uniforms-bootstrap4/RadioField';
import CheckboxGroup from './CheckboxGroupField';
import BaseField from 'uniforms/BaseField';
import ListField from './ListField';
import HiddenField from 'uniforms-bootstrap4/HiddenField';
import BooleanField from 'uniforms-bootstrap4/BoolField';
import DateField from './DateField';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import SimpleSchema from 'simpl-schema';

const components = [{
  type: 'Text Field',
  schema: {
    type: String,
  },
  sidebar: {
    icon: <i className="fa fa-i-cursor"/>,
    text: 'Text Field'
  },
  formElement: TextField
}, {
  type: 'Boolean',
  schema: {
    type: Boolean,
  },
  sidebar: {
    icon: <i className="fa fa-check-square" />,
    text: 'Boolean'
  },
  formElement: BooleanField
}, {
  type: 'Date Field',
  schema: {
    type: String,
    uniforms: {
      type: 'date'
    }
  },
  sidebar: {
    icon: <i className="fa fa-calendar"/>,
    text: 'Date Field'
  },
  admin: {
    schema: new SimpleSchema({
      min: {
        type: Date,
        optional: true
      },
      max: {
        type: Date,
        optional: true
      },
      type: {
        type: String,
        allowedValues: ['date', 'datetime-local']
      }
    })
  },
  formElement: DateField
}, {
  type: 'Hidden Input',
  schema: {
    type: String
  },
  sidebar: {
    icon: <i className="fa fa-eye-slash" />,
    text: 'Hidden Input'
  },
  formElement: HiddenField
}, {
  type: 'Textarea',
  schema: {
    type: String,
    uniforms: {
      rows: 10
    },
  },
  sidebar: {
    icon: <i className="fa fa-pencil-square-o" />,
    text: 'Textarea'
  },
  formElement: LongTextField,
  admin: {
    schema: new SimpleSchema({
      rows: {
        type: Number
      },
    })
  }
}, {
  type: 'Number',
  schema: {
    type: Number
  },
  formElement: NumberField,
  sidebar: {
    icon: <i className="fa fa-hashtag"/>,
    text: 'Number'
  },
  admin: {
    schema: new SimpleSchema({
      min: {
        type: Number,
        optional: true
      },
      max: {
        type: Number,
        optional: true
      },
      step: {
        type: Number,
        optional: true
      }
    })
  }
}, {
  type: 'Radio Group',
  schema: {
    type: String,
    uniforms: {
      options: [{ label: 'one', value: 1 }]
    }
  },
  sidebar: {
    icon: <i className="fa fa-circle-o" />,
    text: 'Radio Group'
  },
  formElement: RadioGroup,
  admin: {
    schema: new SimpleSchema({
      options: {
        type: Array,
        minCount: 1,
        uniforms: {
          label: 'Options',
          removeIcon: <i className="fa fa-minus" style={{ position: 'relative', top: '-15px', left: '17px'}}/> ,
          addIcon: <i className="pull-right fa fa-plus" style={{ position: 'relative', top: '-15px', right: '17px'}}/>,
          component: ListField,
        }
      },
      'options.$': {
        type: Object
      },
      'options.$.label': {
        type: String
      },
      'options.$.value': {
        type: String
      }
    })
  }
}, {
  type: 'Select',
  schema: {
    type: String,
    defaultValue: 1,
    uniforms: {
      options: [{ label: 'one', value: '1' }]
    }
  },
  sidebar: {
    icon: <i className="fa fa-toggle-down" />,
    text: 'Select'
  },
  formElement: SelectField,
  admin: {
    schema: new SimpleSchema({
      options: {
        type: Array,
        custom: function() {
          const seen = {};
          console.log(this.field('options').value);
          this.field('options').value.forEach(option => {
            if (seen[option.value]) {
              throw new Error('Values must be distinct');
            }

            seen[option.value] = true;
          });
        },
        minCount: 1,
        uniforms: {
          label: 'Options',
          removeIcon: <i className="fa fa-minus" style={{ position: 'relative', top: '-15px', left: '17px'}}/> ,
          addIcon: <i className="pull-right fa fa-plus" style={{ position: 'relative', top: '-15px', right: '17px'}}/>,
          component: ListField,
        }
      },
      'options.$': {
        type: Object
      },
      'options.$.label': {
        type: String,
        uniforms: {
          placeholder: 'Label'
        }
      },
      'options.$.value': {
        type: String,
        uniforms: {
          placeholder: 'Value'
        }
      }
    })
  }
},  {
  type: 'Checkbox Group',
  schema: {
    type: Array,
    uniforms: {
      options: [{ label: 'one', value: 1 }]
    }
  },
  sidebar: {
    icon: <i className="fa fa-check-square-o" />,
    text: 'Checkbox Group'
  },
  formElement: CheckboxGroup,
  admin: {
    schema: new SimpleSchema({
      options: {
        type: Array,
        minCount: 1,
        uniforms: {
          label: 'Options',
          removeIcon: <i className="fa fa-minus" style={{ position: 'relative', top: '-15px', left: '17px'}}/> ,
          addIcon: <i className="pull-right fa fa-plus" style={{ position: 'relative', top: '-15px', right: '17px'}}/>,
          component: ListField,
        }
      },
      'options.$': {
        type: Object
      },
      'options.$.label': {
        type: String
      },
      'options.$.value': {
        type: String
      }
    })
  }
}];

class CustomAuto extends BaseField {
  getChildContextName() {
    return this.context.uniforms.name;
  }

  render() {
    const props = this.getFieldProps(undefined, {ensureValue: false});
    const builderComponent = components.find(c => c.type === props.componentType);

    if (builderComponent) {
      return <builderComponent.formElement {...props} />
    }

    return <AutoField {...this.props} />;
  }
}

export default {
  AutoForm,
  AutoField: CustomAuto,
  components
}
