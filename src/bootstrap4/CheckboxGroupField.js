import React        from 'react';
import classnames   from 'classnames';
import connectField from 'uniforms/connectField';
import update from 'immutability-helper';
import wrapField from 'uniforms-bootstrap4/wrapField';

class CheckboxGroupField extends React.Component {
  onCheck(v) {
    const index = this.props.value.indexOf(v);
    if (index >= 0) {
      this.props.onChange(update(this.props.value, { $splice: [[index, 1]] }));
    }
    else {
      this.props.onChange(update(this.props.value, { $push: [v] }));
    }
  }

  render() {
    const props = this.props;
    return wrapField(props, (
      this.props.options.map((item, index) =>
        <div
          key={index}
          className={classnames(
            props.inputClassName,
            'form-check',
            `checkbox${props.inline ? '-inline' : ''}` // bootstrap4 < alpha.6
          )}
        >
          <label htmlFor={`${props.id}-${item.value}`} className="form-check-label">
            <input
              checked={props.value.includes(item.value)}
              className="form-check-input"
              disabled={props.disabled}
              id={`${props.id}-${item.value}`}
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
