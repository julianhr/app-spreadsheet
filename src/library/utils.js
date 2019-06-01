const BASE_CODE_POINT = 'A'.codePointAt(0)

export function buildUrl(baseUrl, query={}) {
  const urlQuery = Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&')
  return [baseUrl.trim(), urlQuery].join('?')
}

export function clamp(value, min, max) {
  return Math.min( Math.max(value, min), max )
}

export function getRangeArray(min, max, isString=false) {
  const range = []

  for (let num = min; num <= max; num++) {
    range.push( isString ? num.toString() : num )
  }

  return range
}

export const sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

export function getColumnNames(cols) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let names = []
  let prevNames = ['']
  let remainCols = cols

  while (remainCols > 0) {
    const newNames = []

    outerLoop:
    for (let colName of prevNames) {  
      for (let letter of alphabet) {
        if (remainCols === 0)  { break outerLoop }
        newNames.push(`${colName}${letter}`)
        remainCols -= 1
      }
    }

    prevNames = newNames
    names = [...names, ...newNames]
  }

  return names
}

export function getCellNames(rows, cols) {
  const names = []
  let colNames = getColumnNames(cols)

  for (let row=1; row <= rows; row++) {
    for (let col of colNames) {
      names.push(`${col}-${row}`)
    }
  }

  return names
}

export function getColumnPosition(colLabel) {
  const letters = colLabel.split('')
  const oneBase = letters.reduce((prev, letter) => (
    prev * 26 + letter.charCodeAt(0) - BASE_CODE_POINT + 1
  ), 0)

  return oneBase - 1
}

export function getColumnLabel(num) {
  const label = []
  const basePoint = BASE_CODE_POINT
  let curr = num + 1

  do {
    curr -= 1
    const letterPosition = curr % 26
    const codePoint = basePoint + letterPosition
    const letter = String.fromCodePoint(codePoint)
    label.push(letter)

    curr = Math.floor(curr / 26)
  } while (curr > 0)

  return label.reverse().join('')
}

export function parseLocation(location) {
  let [col, row] = location.split('-')
  const colIndex = getColumnPosition(col)
  const rowIndex = +row - 1

  return [colIndex, rowIndex]
}

export function isNumber(numStr) {
  const isPeriodsAndDigits = Boolean(numStr.match(/^[.\d]+$/))
  const periodCount = (numStr.match(/\./g) || []).length

  if (!isPeriodsAndDigits) { return false }
  if (periodCount > 1) { return false }
  if (numStr.length === 1 && numStr[0] === '.') { return false }
  return true
}

