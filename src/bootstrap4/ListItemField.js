import React        from 'react';
import connectField from 'uniforms/connectField';
import joinName     from 'uniforms/joinName';
import {Children}   from 'react';

import NestField from './NestField';
import ListDelField from './ListDelField';

const ListItem = ({removeIcon, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        alignContent: 'stretch',
        marginBottom: '10px'
      }}
    >
      <NestField {...props} />
      { !props.isFirst && <ListDelField name={props.name} removeIcon={removeIcon} /> }
      { props.isFirst && <div style={{ flexBasis: '42px'}} />}
    </div>
  );
}

export default connectField(ListItem, {includeInChain: false, includeParent: true});
