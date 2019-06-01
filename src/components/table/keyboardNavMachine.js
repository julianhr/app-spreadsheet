import { Machine, assign } from 'xstate'

import { parseLocation, getColumnLabel } from '~/library/utils'


function getTargetLocation({ rows, columns, rowIndex, colIndex, key }) {
  switch (key) {
    case 'ArrowUp':
      rowIndex = Math.max(0, rowIndex - 1)
      break
    case 'ArrowRight':
      colIndex = Math.min(columns - 1, colIndex + 1)
      break
    case 'ArrowDown':
    case 'Enter':
      rowIndex = Math.min(rows - 1, rowIndex + 1)
      break
    case 'ArrowLeft':
      colIndex = Math.max(0, colIndex - 1)
      break
    default:
      return null
  }

  const colLabel = getColumnLabel(colIndex)
  const rowLabel = '' + (rowIndex + 1)

  return `${colLabel}-${rowLabel}`
}

function focusTargetCell(ctx) {
  if (!ctx.endLocation) { return Promise.resolve(false) }

  return new Promise(resolve => {
    setTimeout(() => {
      const id = `[data-location="${ctx.endLocation}"]`
      const cell = document.querySelector(id)
      if (cell) { cell.focus() }
      resolve(true)
    }, 0)
  })
}

const state = {
  id: 'keyboardNav',
  initial: 'idle',
  context: {
    columns: null,
    rows: null,
    key: null,
    colIndex: null,
    rowIndex: null,
    endLocation: null,
    wasFocused: false,
  },
  states: {
    idle: {
      on: {
        'MOVE_FOCUS': {
          actions: ['setNewContext', 'calcTargetLocation'],
          target: 'focusTarget',
        }
      }
    },
    focusTarget: {
      invoke: {
        src: focusTargetCell,
        onDone: {
          actions: assign({ wasFocused: (ctx, event) => event.data }),
          target: 'idle',
        },
      },
    },
  },
}

const actions = {
  actions: {
    setNewContext: assign((ctx, { key, location }) => {
      const [colIndex, rowIndex] = parseLocation(location)
      return { colIndex, rowIndex, key }
    }),
    calcTargetLocation: assign({
      endLocation: (ctx) => {
        return getTargetLocation(ctx)
      }
    }),
  },
}

function getKeyboardNavMachine(rows, columns) {
  const newContext = {
    ...state.context,
    columns,
    rows,
  }

  return Machine(state, actions, newContext)
}

export {
  state,
  actions,
  getTargetLocation,
  focusTargetCell,
}

export default getKeyboardNavMachine
