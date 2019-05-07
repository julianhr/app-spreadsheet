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
