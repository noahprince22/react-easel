import BaseField from 'uniforms/BaseField';
import React, { Component } from 'react';

const ErrorField = (props, { uniforms: { error, submissionError } }) => {
  const err = submissionError || error;
  if (err) {
    const message = err.message ? err.message : err;
    return <div className="alert alert-danger flash-error" role="alert">
      <div key={message}><strong>Error!</strong> {message}</div>
    </div>;
  }

  return <div />
};

ErrorField.contextTypes = BaseField.contextTypes;

export default ErrorField;
