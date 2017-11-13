import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import SimpleSchema from 'simpl-schema';
import ErrorField from './ErrorField';
import AutoFields from './AutoFields';

//const ErrorField = (props, { uniforms: { error, submissionError } }) => {
//  const err = submissionError || error;
//  if (err) {
//    const message = err.message ? err.message : err;
//    return <div className="alert alert-danger flash-error" role="alert">
//      <div key={message}><strong>Error!</strong> {message}</div>
//    </div>;
//  }
//
//  return <div />
//};
//
//ErrorField.contextTypes = BaseField.contextTypes;
//
//export default ErrorField;

SimpleSchema.extendOptions(['uniforms']);

const style = {
  cursor: 'move',
};
/*paddingTop: '20px',
  paddingBottom: '20px',
  paddingRight: '10px',
  paddingLeft: '10px'*/
const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findItem(props.id).index,
    }
  },

  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveItem(droppedId, originalIndex)
    }
  },
};

const itemTarget = {
  canDrop() {
    return false
  },

  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem()
    const { id: overId } = props

    if (draggedId !== overId) {
      const { index: overIndex } = props.findItem(overId)
      props.moveItem(draggedId, overIndex)
    }
  },
}

@DropTarget([ItemTypes.COMPONENT, ItemTypes.ITEM], itemTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.ITEM, itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    this.editElement = this.editElement.bind(this);
    this.copyElement = this.copyElement.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  async editElement() {
    const editing = this.state.editing;
    if (editing) {
      try {
        await this.adminForm.submit();
        this.setState({ editing: false });
      }
      catch (err) {
        // We don't really care, this is going to be validation errors
        console.error(err);
      }
    }
    else {
      this.setState({ editing: true });
    }
  }

  copyElement() {
    const { createItem, card } = this.props;

    return createItem({ ...card, name: card.name + '_copy' });
  }

  submitEdit(props) {
    const { updateItem } = this.props;

    updateItem(props);
    this.setState({ editing: false });
  }

  getSchema() {
    const { admin } = this.props;

    const AdminSchema = new SimpleSchema({
      optional: {
        type: Boolean,
        optional: true,
        defaultValue: true,
        uniforms: {
          label: 'Allow Blank?'
        }
      },
      label: String,
      help: {
        type: String,
        optional: true,
        uniforms: {
          label: 'Help Text'
        }
      },
      placeholder: {
        type: String,
        optional: true
      },
      name: String,
      value: {
        type: String,
        optional: true
      }
    });

    const adminSchema = admin ? admin.schema : new SimpleSchema({});
    return AdminSchema.extend(adminSchema);
  }
  render() {
    const {
            isDragging,
            preview,
            connectDragSource,
            connectDropTarget,
            AutoField,
            card,
            removeItem,
            AutoForm
          } = this.props;
    const { editing } = this.state;

    // Don't want type in the model. If there's type, it should be a uniforms prop.
    // Useful for things like the Date field that can be type date or datetime-local
    const { type, uniforms, ...topLevelFieldProps } = card;
    const model = {
      ...topLevelFieldProps,
      ...uniforms,
    };

    return connectDragSource(
      connectDropTarget(
        <div className={`element ${(preview || isDragging) ? 'dragging' : ''}`}>
          { !(preview || isDragging) && <div className="field-actions">
            <i onClick={removeItem} className="btn del-button fa fa-times"/>
            <i onClick={this.editElement} className="btn toggle-form fa fa-pencil"/>
            <i onClick={this.copyElement} className="btn copy-button fa fa-clone"/>
          </div> }
          { editing &&
            <div className="form-elements">
              <AutoForm
                AutoField={AutoField}
                ref={af => this.adminForm = af}
                schema={this.getSchema()}
                model={model}
                onSubmit={this.submitEdit}
                modelTransform={(mode, model) => {
                  // This model will be submitted.
                  if (mode === 'submit') {
                    const { name, optional, ...uniforms } = model;
                    return {
                      name,
                      type,
                      optional,
                      uniforms
                    };
                  }

                  // Otherwise, return unaltered model.
                  return model;
                }}
              >
                <AutoFields autoField={AutoField} />
                <ErrorField/>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-link" onClick={() => this.setState({ editing: false })}>Cancel</button>
                  <button
                    type="submit"
                    style={{ cursor: 'pointer' }}
                    className="btn btn-info"
                    onClick={() => {
                      this.adminForm.submit();
                    }}
                  >Save
                  </button>
                </div>
              </AutoForm>
            </div>
          }
          { !editing &&
            // Shouldn't have to pass in uniforms explicitly, but placeholder only works when I do this.
            <div className="form-element">
              <AutoField {...card.uniforms} name={card.name} style={style}/>
            </div>
          }
        </div>),
    )
  }
}
