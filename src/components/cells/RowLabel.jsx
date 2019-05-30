import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'


const Wrapper = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};
  background: ${props => props.theme.colors.cell.labelBkg};
`

function RowLabel({ label }) {
  return (
    <td>
      <Wrapper
        className='row-label-width row-label-height'
      >
        {label}
      </Wrapper>
    </td>
  )
}

RowLabel.propTypes = {
  label: PropTypes.number,
}

export default RowLabel
