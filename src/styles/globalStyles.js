import theme from './theme'

const globalStyles = {
  'body': {
    color: `${theme.colors.text}`,
    lineHeight: '1.3em',
  },
  'p, h1, h2, h3, h4, h5, h6': {
    margin: 0,
  },
  'p': {
    padding: '.8em 0'
  },
  'h1': {
    fontSize: 44,
  },
  'h2': {
    lineHeight: '2em',
    fontSize: 34,
  },
  'h3': {
    fontSize: 24,
  },
  'h4': {
    lineHeight: '1.7em',
    fontSize: 18,
  },
  'h5': {
    fontSize: 12,
  },
  'h6': {
    fontSize: 8,
  },
  'code': {
    color: '#c23838',
    fontSize: 14,
  }
}

export default globalStyles
