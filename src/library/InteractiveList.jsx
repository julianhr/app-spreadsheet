
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import InteractiveListItem from './InteractiveListItem'


const Ul = styled.ul`
  position: fixed;
  margin: 0;
  padding: 0;
  list-style: none;
`

class InteractiveList extends React.PureComponent {
  static propsTypes = {
    selectedFn: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    styles: PropTypes.shape({
      ul: PropTypes.object,
      li: PropTypes.object,
    }),
  }

  state = {
    activeIndex: 0,
    selectedIndex: null,
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line
    this.fireSelected()
  }

  fireSelected() {
    if (this.state.selectedIndex === null) { return }
    const item = this.props.items[this.state.selectedIndex]
    this.props.selectedFn(item.value)
  }

  renderListItems() {
    return this.props.items
      .map((item, i) => (
        <InteractiveListItem
          key={i}
          item={item.item}
          style={{...this.props.styles.li}}
          isActive={item.isActive}
        />
      ))
  }

  render() {
    const { items, top, left, styles } = this.props

    if (items.length === 0) { return null }

    return (
      <Ul
        tabIndex={-1}
        style={{ top, left, ...styles.ul }}
        onClick={this.handleOnClick}
      >
        {this.renderListItems()}
      </Ul>
    )
  }
}

export default InteractiveList
