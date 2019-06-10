import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'


const InnerBorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};
  background: ${props => props.theme.colors.cell.labelBkg};
  font-size: 12px;
`

function ColLabel({ label }) {
  return (
    <InnerBorder
      data-col={label}
      className='col-label-width col-label-height'
    >
      {label}
    </InnerBorder>
  )
}

ColLabel.propTypes = {
  label: PropTypes.string,
}

export default ColLabel
