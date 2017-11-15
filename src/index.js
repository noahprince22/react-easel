import React from 'react';
import { render } from 'react-dom';
import FormBuilder from './FormBuilder';
import defaults from './bootstrap4/defaults';
import ReactJson from 'react-json-view'
import { Debounce } from 'react-throttle';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {}
    }
  }

  render() {
    return (
      <div className="container">
        <h1>React Easel</h1>
        <div style={{ marginBottom: '20px' }}>
          <Debounce time="500" handler="onSchemaChange">
            <FormBuilder
              onSchemaChange={(schema) => this.setState({ schema })}
              {...defaults}
            />
          </Debounce>
        </div>

        <h4>Schema JSON</h4>
        <div>
          <ReactJson
            displayDataTypes={false}
            name={false}
            src={this.state.schema}
          />
        </div>
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
);
