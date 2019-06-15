import { clamp } from '~/library/utils'
import {
  MIN_COL_WIDTH,
  MAX_COL_WIDTH,
  MIN_ROW_HEIGHT,
  MAX_ROW_HEIGHT,
} from '~/library/constants'


export function setColWidth(colLabel, width) {
  if (typeof width !== 'number') {
    throw new Error('width is not a number')
  }

  return {
    type: 'SET_COL_WIDTH',
    payload: { colLabel, width: clamp(width, MIN_COL_WIDTH, MAX_COL_WIDTH) }
  }
}

export function setRowHeight(rowLabel, height) {
  if (typeof height !== 'number') {
    throw new Error('height is not a number')
  }

  return {
    type: 'SET_ROW_HEIGHT',
    payload: { rowLabel, height: clamp(height, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT) }
  }
}
