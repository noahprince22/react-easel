import React          from 'react';
import classnames     from 'classnames';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import injectName     from 'uniforms/injectName';
import joinName       from 'uniforms/joinName';
import AutoField    from 'uniforms-bootstrap4/AutoField';

const Nest = ({
                children,
                className,
                error,
                errorMessage,
                fields,
                itemProps,
                label,
                name,
                isFirst,
                showInlineError,
                ...props
              }) => {

  // Only show 'Label', 'Value' over the first two
  const labelShowingProps = isFirst ? {} : { label: null, grid: null, wrapClassName: null };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      width: '100%',
      alignContent: 'stretch'
    }}
    >
      {label && (
        <label>
          {label}
        </label>
      )}

      {!!(error && showInlineError) && (
        <span className="text-danger">
                {errorMessage}
            </span>
      )}

      {
        fields.map(key =>
          <AutoField key={key} name={joinName(name, key)} {...itemProps} style={{ flex: 1, marginRight: '5px', marginLeft: '5px' }}  {...labelShowingProps} />
        )
      }
    </div>
  )
}

;

export default connectField(Nest, {includeInChain: false});
