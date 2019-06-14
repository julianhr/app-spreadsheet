import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from '@testing-library/react'

import MockApp from '~/__tests__/__mocks__/MockApp'
import ConnectedTable, { Table } from '../Table'
import { appStoreGen } from '~/reducers'
import { sleep } from '~/library/utils'


const requiredProps = {
  rows: 3,
  columns: 2,
}

const testProps = {
  ...requiredProps,
  activeCell: '[data-location="B-2"]',
}

const createApp = (props) => create(<MockApp><Table {...props} /></MockApp>)

const renderApp = (props, customStore) => {
  const store = customStore || appStoreGen()
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

      const cell = document.querySelector('[data-location="B-2"]')
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

      const cell = document.querySelector('[data-location="B-2"]')
      fireEvent.keyDown(cell, { key: 'a' })
      expect(onKeyDownFn).not.toHaveBeenCalled()
    })

    it('moves focus using keyboard', async () => {
      renderApp(testProps)
      let cell = document.querySelector('[data-location="B-2"]')
      fireEvent.select(cell)
      expect(document.activeElement).toBe(cell)

      fireEvent.keyDown(cell, { key: 'ArrowUp' })
      await sleep(0)
      cell = document.querySelector('[data-location="B-1"]')
      expect(document.activeElement).toBe(cell)
    })
  })

  describe('#moveFocus', () => {
    it('moves focus using keyboard', async (done) => {
      renderApp(testProps)
      const tests = [
        ['ArrowDown', '[data-location="A-2"]'],
        ['ArrowRight', '[data-location="B-2"]'],
        ['Enter', '[data-location="B-3"]'],
        ['ArrowLeft', '[data-location="A-3"]'],
      ]
      let cell = document.querySelector('[data-location="A-1"]')
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
      const store = appStoreGen()
      const { global } = store.getState()
      global.rows = 2
      global.columns = 3
      renderApp(testProps, store)
      const el = document.querySelector('[data-table="app"]')
      expect(el).toMatchSnapshot()
    })
  })
})
