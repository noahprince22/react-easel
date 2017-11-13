import React, { Component } from 'react'
import update from 'immutability-helper'
import { DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Item from './Item'
import ItemTypes from './ItemTypes'
import FormComponent from './FormComponent';
import 'font-awesome/css/font-awesome.css';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['uniforms']);

import './FormBuilder.css';

const styles = {
  emptyStateWrapper: {
    textAlign: 'center',
    minHeight: '75px'
  },
  emptyState: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  parent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start'
  },
  left: {
    flexGrow: 10,
    marginRight: '10px',
    border: '1px solid #ccc',
    padding: '3px',
  },
  leftDragarea: {
    flexGrow: 4,
    border: '3px dashed #ccc',
    backgroundColor: 'hsla(0,0%,100%,.25)',
    padding: '5px'
  },
  right: {
    margin: 0,
    padding: 0,
    flexGrow: 0,     /* do not grow   - initial value: 0 */
    flexShrink: 0,   /* do not shrink - initial value: 1 */
    flexBasis: '175px',
    borderRadius: '5px',
  },
  firstItem: {
    borderRadius: '5px 5px 0 0',
    marginTop: 0
  },
  lastItem: {
    borderRadius: '0 0 5px 5px',
  },
  item: {
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
  }
};

const itemTarget = {
  drop() {},
};

const componentTarget = {
  drop() {},
}

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.ITEM, itemTarget, connect => ({
  connectItemDropTarget: connect.dropTarget(),
}))
@DropTarget(ItemTypes.COMPONENT, componentTarget, connect => ({
  connectComponentDropTarget: connect.dropTarget(),
}))
export default class FormBuilder extends Component {
  static defaultProps = {
    schema: {}
  };

  constructor(props) {
    super(props);
    this.moveItem = this.moveItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.findItem = this.findItem.bind(this);
    this.createItem = this.createItem.bind(this);
    this.getSchemaJson = this.getSchemaJson.bind(this);

    this.state = {
      cards: this.getCards(props)
    }
  }

  getSchemaJson(cards = this.state.cards) {
    return cards.reduce((s, card) => {
      const { id, preview, name, ...other } = card;
      s[name] = other;

      if (card.type === Array) {
        s[name].blackbox = true;
        s[name + '.$'] = {
          type: Object,
          blackbox: true
        }
      }

      return s;
    }, {});
  }

  updateCards(cards) {
    this.setState({
      cards
    });

    this.props.onSchemaChange(cards);
  }

  getCards(props) {
    // Filter out array object (ends in .$)
    let id = 0;
    return Object.keys(props.schema).filter(k => !k.match(/\.\$$/)).map(name => ({
      name,
      id: ++id,
      ...props.schema[name]
    }))
  }

  createItem(props) {
    const maxId = this.state.cards.reduce((max, item) => {
      if (item.id > max) {
        return item.id;
      }

      return max;
    }, this.state.cards[0] ? this.state.cards[0].id : 0);

    const item = { ...props, id: maxId + 1 };

    this.updateCards(this.state.cards.concat([item]));

    return item
  }

  getComponent(type) {
    return this.props.components.find(c => c.type === type);
  }

  setItem(id, newItem) {
    const { card, index } = this.findItem(id);

    this.updateCards(update(this.state.cards, {
      $splice: [[index, 1], [index, 0, {...card, ...newItem}]]
    }));
  }

  removeItem(id) {
    const { index } = this.findItem(id);
    this.updateCards(update(this.state.cards, {
      $splice: [[index, 1]]
    }));
  }

  moveItem(id, atIndex) {
    const { card, index } = this.findItem(id);
    this.updateCards(update(this.state.cards, {
      $splice: [[index, 1], [atIndex, 0, card]],
    }));
  }

  findItem(id) {
    const { cards } = this.state
    const card = cards.filter(c => c.id === id)[0]

    return {
      card,
      index: cards.indexOf(card),
    }
  }

  getSchema() {
    return new SimpleSchema(this.getSchemaJson(this.state.cards));
  }

  render() {
    const { connectItemDropTarget, connectComponentDropTarget, components: formComponents } = this.props;
    const { cards } = this.state;

    const Form = this.props.AutoForm;

    const leftContainer = connectComponentDropTarget(
      connectItemDropTarget(
        <div style={styles.leftWrapper}>
          <Form schema={this.getSchema()} model={{}} onSubmit={(form) =>{ debugger}}>
            { cards.length === 0 &&
              <div style={styles.emptyStateWrapper}>
                <span style={styles.emptyState}>Drag a field from the right to this area</span>
              </div>
            }
            {cards.map(card => (
              <Item
                card={card}
                admin={this.getComponent(card.uniforms.componentType).admin}
                preview={card.preview}
                id={card.id}
                key={card.id}
                AutoField={this.props.AutoField}
                AutoForm={Form}
                moveItem={this.moveItem}
                findItem={this.findItem}
                removeItem={() => this.removeItem(card.id)}
                updateItem={(newItem) => {
                  this.setItem(card.id, newItem)
                }}
                createItem={this.createItem}
              />
            ))}
          </Form>
        </div>
      )
    );

    const rightContainer = <div>
      {formComponents.map((formComponent, index) => {
        let style = styles.item;
        if (index === 0) {
          style = { ...styles.firstItem, ...style }
        }
        if (index === formComponents.length - 1) {
          style = { ...styles.lastItem, ...style }
        }
        return (
          <div key={index} className="item" style={style}>
            <FormComponent
              formComponent={formComponent}
              createItem={this.createItem}
              setItem={this.setItem}
              removeItem={this.removeItem}
            />
          </div>
        )
      })}
    </div>;

    return <div style={styles.parent}>
      <div style={styles.left}>
        <div style={styles.leftDragarea}>
          { leftContainer }
        </div>
      </div>
      <div style={styles.right}>
        { rightContainer }
      </div>
    </div>
  }
}
