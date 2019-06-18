import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import emotionSerializer from 'jest-emotion'

import MockApp from '~/__tests__/__mocks__/MockApp'
import { OutterBorder } from '../OutterBorder'


const requiredProps = {
  location: 'A-3',
  onClick: jest.fn(),
  onDoubleClick: jest.fn(),
}

const testProps = {
  ...requiredProps,
  width: 100,
  height: 30,
}

const renderApp = (props) => {
  return render(
    <MockApp>
      <OutterBorder {...props}>
        Test
      </OutterBorder>
    </MockApp>
  )
}

describe('OutterBorder', () => {
  afterEach(cleanup)

  test('required props', () => {
    Object.keys(requiredProps).forEach(prop => {
      const props = { ...requiredProps }
      delete props[prop]
      expect(() => renderApp(props)).toThrow()
    })
  })

  test('default width and height', () => {
    renderApp(requiredProps)
    expect.addSnapshotSerializer(emotionSerializer)
    const el = document.querySelector('[data-cell="border"]')
    expect(el).toMatchSnapshot()
  })

  test('specified width and height', () => {
    renderApp(testProps)
    expect.addSnapshotSerializer(emotionSerializer)
    const el = document.querySelector('[data-cell="border"]')
    expect(el).toMatchSnapshot()
  })
})
