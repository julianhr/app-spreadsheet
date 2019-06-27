import React from 'react'
import { interpret } from 'xstate'

import { parseLocation } from '~/library/utils'
import getKeyboardNavMachine, { getTargetLocation, focusTargetCell } from '../keyboardNavMachine'
import { sleep } from '~/library/utils'

function getKeyEvent({ key, shiftKey, altKey, optKey }) {
  shiftKey = !!shiftKey
  altKey = !!altKey
  optKey = !!optKey
  return { key, shiftKey, altKey, optKey }
}

describe('keyboardNavMachine', () => {
  const rows = 10
  const columns = 26
  let service

  beforeEach(() => {
    const machine = getKeyboardNavMachine(rows, columns)
    service = interpret(machine)
    service.start()
  })

  afterEach(() => {
    service.stop()
  })

  it('initializes at "idle"', () => {
    expect(service.state.matches('idle')).toBe(true)
  })

  it('parses initial context', () => {
    const location = 'C-7'
    const keyEvent = getKeyEvent({ key: 'ArrowUp' })
    const state = service.send({ type: 'MOVE_FOCUS', location, keyEvent })
    expect(state.context.keyEvent).toBe(keyEvent)
    expect(state.context.colIndex).toEqual(2)
    expect(state.context.rowIndex).toEqual(6)
  })

  it('sets target cell', () => {
    const location = 'C-7'
    const keyEvent = getKeyEvent({ key: 'ArrowUp' })
    const state = service.send({ type: 'MOVE_FOCUS', location, keyEvent })
    expect(state.context.endLocation).toEqual('C-6')
  })

  it('sets document focus on target cell', async () => {
    const location = 'C-7'
    const keyEvent = getKeyEvent({ key: 'ArrowUp' })

    service.send({ type: 'MOVE_FOCUS', location, keyEvent })
    await sleep(0)
    expect(service.state.context.wasFocused).toBe(true)
  })

  it('does nothing if key is invalid', async (done) => {
    const keys = ['a', '6', ',']
    const location = 'C-7'

    for (let key of keys) {
      const keyEvent = getKeyEvent({ key })
      service.send({ type: 'MOVE_FOCUS', location, keyEvent })
      await sleep(0)
      expect(service.state.context.wasFocused).toBe(false)
    }
    done()
  })
})


describe('#getTargetLocation', () => {
  const rows = 10
  const columns = 26

  describe('up', () => {
    const keyEvent = getKeyEvent({ key: 'ArrowUp' })

    it('returns same location if row is first one', () => {
      const location = 'C-1'
      const [colIndex, rowIndex] = parseLocation(location)
      const context = { rows, columns, keyEvent, colIndex, rowIndex }
      expect(getTargetLocation(context)).toEqual(location)
    })

    it('returns one row up if row > 0', () => {
      const location = 'C-5'
      const [colIndex, rowIndex] = parseLocation(location)
      const context = { rows, columns, keyEvent, colIndex, rowIndex }
      expect(getTargetLocation(context)).toEqual('C-4')
    })
  })

  describe('right', () => {
    const keyEvents = [
      { key: 'ArrowRight' },
      { key: 'Tab' },
    ]

    for (let keyEvent of keyEvents) {
      it('returns same location if column is last one', () => {
        const location = 'Z-5'
        const [colIndex, rowIndex] = parseLocation(location)
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual(location)
      })
  
      it('returns one column to the right if col < columns - 1', () => {
        const location = 'C-5'
        const [colIndex, rowIndex] = parseLocation(location)
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual('D-5')
      })
    }
  })

  describe('down', () => {
    const keys = ['ArrowDown', 'Enter']

    function tests(key) {
      it('returns same location if row is last one', () => {
        const location = 'C-10'
        const [colIndex, rowIndex] = parseLocation(location)
        const keyEvent = getKeyEvent({ key })
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual(location)
      })
  
      it('returns one row down if row < rows - 1', () => {
        const location = 'C-5'
        const [colIndex, rowIndex] = parseLocation(location)
        const keyEvent = getKeyEvent({ key })
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual('C-6')
      })
    }

    keys.forEach(tests)
  })

  describe('left', () => {
    const keyEvents = [
      { key: 'ArrowLeft' },
      { key: 'Tab', shiftKey: true, },
    ]

    for (let keyEvent of keyEvents) {
      it('returns same location if column is first one', () => {
        const location = 'A-5'
        const [colIndex, rowIndex] = parseLocation(location)
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual(location)
      })
  
      it('returns one column to the left if col > 0', () => {
        const location = 'C-5'
        const [colIndex, rowIndex] = parseLocation(location)
        const context = { rows, columns, keyEvent, colIndex, rowIndex }
        expect(getTargetLocation(context)).toEqual('B-5')
      })
    }
  })
})


describe('#focusTargetCell', () => {
  it('resolves to false if key is null', async () => {
    const ctx = { endLocation: null }
    await expect(focusTargetCell(ctx)).resolves.toBe(false)
  })

  it('resolves to true if key is valid', async () => {
    const ctx = { endLocation: 'C-5' }
    await expect(focusTargetCell(ctx)).resolves.toBe(true)
  })
})
