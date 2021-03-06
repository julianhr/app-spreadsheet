
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import InteractiveListItem from './InteractiveListItem'


const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

class InteractiveList extends React.PureComponent {

  static propsTypes = {
    onMouseEnter: PropTypes.func,
    items: PropTypes.array.isRequired,
    styles: PropTypes.shape({
      ul: PropTypes.object,
      li: PropTypes.object,
    }),
  }

  renderListItems() {
    return this.props.items
      .map((item, index) => (
        <InteractiveListItem
          key={index}
          index={index}
          item={item.item}
          style={{...this.props.styles.li}}
          isActive={item.isActive}
          onMouseEnter={this.props.onMouseEnter}
        />
      ))
  }

  render() {
    const { items, styles } = this.props

    if (items.length === 0) { return null }

    return (
      <Ul
        tabIndex={-1}
        style={styles.ul}
      >
        {this.renderListItems()}
      </Ul>
    )
  }
}

export default InteractiveList
