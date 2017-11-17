import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

const create = (props, preview = false) => {
  const item = props.createItem({
    name: props.formComponent.sidebar.text + parseInt(Math.random() * 10000, 10),
    ...props.formComponent.schema,
    optional: true,
    uniforms: {
      ...(props.formComponent.schema || {}).uniforms,
      componentType: props.formComponent.type,
      label: props.formComponent.sidebar.text,
      placeholder: '', // Uniforms has incredibly weird logic about when to display placeholders. And you can't set it
      // not to fallback to label. So if placeholder isn't undefined, the logic works the way I want it to --
      // that is, no placeholder unless specified in the schema.
    },
    preview
  });
  return item;
};

const formComponentSource = {
  beginDrag(props) {
    return create(props, true);
  },

  endDrag(props, monitor) {
    const { id: droppedId } = monitor.getItem();
    const didDrop = monitor.didDrop();
    props.setItem(droppedId, { preview: false });
    if (!didDrop) {
      props.removeItem(droppedId);
    }
  }
};

const styles = {
  parent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: '100%',
    cursor: 'move',
    listStyle: 'none',
    margin: '0 0 -1px',
    padding: '10px',
    textAlign: 'left',
    background: '#fff',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px #c5c5c5'
  },
  icon: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '20px',
    marginRight: '5px'
  },
  verticalCenter: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  text: {
    flexGrow: 10
  }
};

@DragSource(ItemTypes.COMPONENT, formComponentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class FormComponent extends Component {
  render() {
    const {
            isDragging,
            connectDragSource,
            formComponent: { sidebar: { icon, text } },
            style
          } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(
      <div className="item" onClick={() => create(this.props)} style={{ ...style, ...styles.parent, opacity }}>
        <div style={styles.icon}>
          <div style={{ textAlign: 'center', ...styles.verticalCenter }}>
            {icon}
          </div>
        </div>
        <div style={styles.text}>
          <div style={styles.verticalCenter}>
            {text}
          </div>
        </div>
      </div>
    )
  }
}
