import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import emotionSerializer from 'jest-emotion'

import MockApp from '~/__tests__/__mocks__/MockApp'
import Datum from '../Datum'


const requiredProps = {
  fwdRef: React.createRef(),
  result: 5,
  onClick: jest.fn(),
  onKeyDown: jest.fn(),
  onDoubleClick: jest.fn(),
  onFocus: jest.fn(),
  isActive: true,
}

const testProps = {
  ...requiredProps,
}

const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <Datum {...props} />
    </MockApp>
  )

  return wrapper
}

describe('Datum', () => {
  afterEach(cleanup)

  test('required props', () => {
    Object.keys(requiredProps).forEach(key => {
      const props = {...testProps}
      delete props[key]
      expect(() => renderApp(props)).toThrow()
    })
  })

  test('result is string', () => {
    const props = { ...testProps }
    props.result = 'test'
    renderApp(props)
    expect.addSnapshotSerializer(emotionSerializer)
    expect(document.querySelector('[data-cell="result"]')).toMatchSnapshot()
  })

  test('result is number', () => {
    const props = { ...testProps }
    props.result = 5
    renderApp(props)
    expect.addSnapshotSerializer(emotionSerializer)
    expect(document.querySelector('[data-cell="result"]')).toMatchSnapshot()
  })
})
