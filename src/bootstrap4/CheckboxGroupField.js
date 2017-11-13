import React        from 'react';
import classnames   from 'classnames';
import connectField from 'uniforms/connectField';

import wrapField from 'uniforms-bootstrap4/wrapField';

class CheckboxGroupField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.getChecked(props)
    };

    this.onCheck = this.onCheck.bind(this)
  }

  componentWillReceiveProps(props) {
    this.setState({
      checked: this.getChecked(props)
    })
  }

  getChecked(props) {
    return props.checked ? props.checked.reduce((obj, checkedV) => {
      obj[checkedV] = true;
      return obj;
    }, {}) : {}
  }

  onCheck(v) {
    this.setState({
      checked: {
        ...this.state.checked,
        [v]: !this.state.checked[v]
      }
    }, () => {
      const checkedValues = Object.keys(this.state.checked).filter(v => this.state.checked[v]);
      this.props.onChange(checkedValues);
    });
  }

  render() {
    const props = this.props;
    return wrapField(props, (
      this.props.options.map(item =>
        <div
          key={item.value}
          className={classnames(
            props.inputClassName,
            'form-check',
            `checkbox${props.inline ? '-inline' : ''}` // bootstrap4 < alpha.6
          )}
        >
          <label htmlFor={`${props.id}-${item}`} className="form-check-label">
            <input
              checked={this.state.checked[item.value]}
              className="form-check-input"
              disabled={props.disabled}
              id={`${props.id}-${item}`}
              name={props.name}
              onChange={() => this.onCheck(item.value)}
              type="checkbox"
            />
            { ' ' }
            { item.label }
          </label>
        </div>
      )
    ))
  }

}

export default connectField(CheckboxGroupField);
