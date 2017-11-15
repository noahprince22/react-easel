import React          from 'react';
import classnames     from 'classnames';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import joinName       from 'uniforms/joinName';
import {Children}     from 'react';

import ListAddField  from './ListAddField';
import ListItemField from './ListItemField';
import ListDelField from './ListDelField';

import './ListField.css';

const List = ({
                addComponent,
                children,
                className,
                error,
                errorMessage,
                initialCount,
                itemProps,
                label,
                name,
                removeIcon,
                showInlineError,
                value,
                ...props
              }) =>
  <div>
    <label>{ label }</label>
    <div>
      <div className="list-field-list">
        { value.map((item, index) =>
          <ListItemField
            key={index}
            label={null}
            isFirst={index === 0}
            name={joinName(name, index)}
            {...itemProps}
          />
        ) }
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <ListAddField name={`${name}.$`} initialCount={initialCount} addComponent={addComponent}/>
      </div>
    </div>
  </div>
;

export default connectField(List, {includeInChain: false});
