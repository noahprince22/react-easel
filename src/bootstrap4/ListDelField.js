import React          from 'react';
import classnames     from 'classnames';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import './ListDelField.css';

const ListDel = ({
                   disabled,
                   name,
                   parent
                 }) => {
  const fieldIndex      = +name.slice(1 + name.lastIndexOf('.'));
  const limitNotReached = !disabled && !(parent.minCount >= parent.value.length);

  return (
    <div className="del-wrapper">
      <button
        className="btn btn-link delete-item"
        onClick={() => limitNotReached && parent.onChange([]
          .concat(parent.value.slice(0, fieldIndex))
          .concat(parent.value.slice(1 + fieldIndex))
        )}
      >
        <span className="fa fa-times-circle-o" />
      </button>
    </div>
  );
};

export default connectField(ListDel, {includeParent: true, initialValue: false});
