import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'

import MockApp from '~/__tests__/__mocks__/MockApp'
import ConnectedTable, { Table } from '../Table'
import appStoreGen from '~/reducers'
import { sleep } from '~/library/utils'


const requiredProps = {
  rows: 6,
  columns: 6,
}

const testProps = {
  ...requiredProps,
  activeCell: '#t-B-2',
}

const createApp = (props) => create(<MockApp><Table {...props} /></MockApp>)

const renderApp = (props) => {
  const store = appStoreGen()
  const wrapper = render(
    <MockApp customStore={store}>
      <ConnectedTable {...props} />
    </MockApp>
  )
  return [wrapper, store]
}

describe('Table', () => {
  afterEach(cleanup)

  describe('props', () => {
    it('does not raise warning if all required props are passed', () => {
      expect(() => createApp(testProps)).not.toThrow()
    })

    it('raises warning if required prop is missing', () => {
      Object.keys(requiredProps).forEach(key => {
        const props = {...testProps}
        delete props[key]
        expect(() => createApp(props)).toThrow()
      })
    })
  })

  describe('#handleTableOnClick', () => {
    it('stops propagation of key down events', () => {
      const onClickFn = jest.fn()
      const Listener = ({ children }) => (<div onClick={onClickFn}>{children}</div>)
  
      render(
        <MockApp>
          <Listener>
            <Table {...testProps} />
          </Listener>
        </MockApp>
      )

      const cell = document.querySelector('#t-B-2')
      fireEvent.click(cell)
      expect(onClickFn).not.toHaveBeenCalled()
    })
  })

  describe('#handleTableOnKeyDown', () => {
    it('stops propagation of key down events', () => {
      const onKeyDownFn = jest.fn()
      const Listener = ({ children }) => (<div onKeyDown={onKeyDownFn}>{children}</div>)
  
      render(
        <MockApp>
          <Listener>
            <Table {...testProps} />
          </Listener>
        </MockApp>
      )

      const cell = document.querySelector('#t-B-2')
      fireEvent.keyDown(cell, { key: 'a' })
      expect(onKeyDownFn).not.toHaveBeenCalled()
    })

    it('moves focus using keyboard', async () => {
      renderApp(testProps)
      let cell = document.querySelector('#t-B-2')
      fireEvent.select(cell)
      expect(document.activeElement).toBe(cell)

      fireEvent.keyDown(cell, { key: 'ArrowUp' })
      await sleep(0)
      cell = document.querySelector('#t-B-1')
      expect(document.activeElement).toBe(cell)
    })
  })

  describe('#moveFocus', () => {
    it('moves focus using keyboard', async (done) => {
      renderApp(testProps)
      const tests = [
        ['ArrowDown', '#t-A-2'],
        ['ArrowRight', '#t-B-2'],
        ['Enter', '#t-B-3'],
        ['ArrowLeft', '#t-A-3'],
      ]
      let cell = document.querySelector('#t-A-1')
      fireEvent.select(cell)
      expect(document.activeElement).toBe(cell)

      for (let [key, location] of tests) {
        fireEvent.keyDown(cell, { key })
        await sleep(0)
        cell = document.querySelector(location)
        expect(document.activeElement).toBe(cell)
      }

      done()
    })
  })

  describe('functional tests', () => {
    it('matches snapshot', () => {
      const [wrapper, _] = renderApp(testProps)
      expect(wrapper.asFragment()).toMatchSnapshot()
    })
  })
})
