import React, { Component } from 'react';
import update from 'immutability-helper';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Item from './Item';
import ItemTypes from './ItemTypes';
import FormComponent from './FormComponent';
import SimpleSchema from 'simpl-schema';
import 'font-awesome/css/font-awesome.css';
import './FormBuilder.css';

SimpleSchema.extendOptions(['uniforms']);

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
    flexBasis: '225px',
    borderRadius: '5px',
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

  static getSchemaJson(cards) {
    return cards.reduce((s, card) => {
      const { id, preview, name, ...other } = card;
      s[name] = other;

      if (card.type === Array) {
        s[name].blackbox = true;
        s[name + '.$'] = {
          type: Object,
          blackbox: true,
          uniforms: other.uniforms
        }
      }

      return s;
    }, {});
  }

  constructor(props) {
    super(props);
    this.moveItem = this.moveItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.findItem = this.findItem.bind(this);
    this.createItem = this.createItem.bind(this);

    this.state = {
      cards: this.getCards(props)
    }
  }

  updateCards(cards) {
    this.setState({
      cards
    });

    this.props.onSchemaChange && this.props.onSchemaChange(this.constructor.getSchemaJson(cards));
    this.props.onCardChange && this.props.onCardChange(cards);
  }

  getCards(props) {
    let id = 0;
    if (props.cards) {
      return props.cards.map(c => ({
        ...c,
        id: (++id)
      }));
    }

    // Filter out array object (ends in .$)
    return Object.keys(props.schema).filter(k => !k.match(/\.\$$/)).map(name => ({
      ...props.schema[name],
      name,
      id: (++id)
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
    return new SimpleSchema(this.constructor.getSchemaJson(this.state.cards));
  }

  render() {
    const { connectItemDropTarget, connectComponentDropTarget, components: formComponents } = this.props;
    const { cards } = this.state;

    const Form = this.props.AutoForm;

    const leftContainer = connectComponentDropTarget(
      connectItemDropTarget(
        cards.length === 0 ?
        <div style={styles.leftWrapper}>
          <div style={styles.leftDragarea}>
            <div style={styles.emptyStateWrapper}>
              <span style={styles.emptyState}>Drag a field from the right to this area</span>
            </div>
          </div>
        </div> :
          <div style={styles.leftWrapper}>
            <Form schema={this.getSchema()} model={{}}>
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
      {formComponents.map((formComponent, index) => (
          <FormComponent
            key={formComponent.type}
            formComponent={formComponent}
            createItem={this.createItem}
            setItem={this.setItem}
            removeItem={this.removeItem}
          />
        )
      )}
    </div>;

    return <div style={styles.parent}>
      <div style={styles.left}>
        { leftContainer }
      </div>
      <div style={styles.right}>
        { rightContainer }
      </div>
    </div>
  }
}
