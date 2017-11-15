import React          from 'react';
import connectField   from 'uniforms/connectField';

const ListAdd = ({
                   addComponent,
                   disabled,
                   parent,
                   value,
                 }) => {
  const limitNotReached = !disabled && !(parent.maxCount <= parent.value.length);

  return (
    <div onClick={() => limitNotReached && parent.onChange(parent.value.concat([value]))} className="option-actions">
      { limitNotReached && addComponent }
    </div>
  );
};

ListAdd.defaultProps = {addComponent: <button style={{ cursor: 'pointer' }} className="btn btn-link add add-opt">+ Add Option</button>};

export default connectField(ListAdd, {includeParent: true, initialValue: false});
