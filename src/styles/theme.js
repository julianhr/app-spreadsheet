const colors = {
  text: '#3D3D3D',
  primary: {
    strong: '#E10D75'
  },
  field: {
    background: '#F0F0F0',
  },
}

const breaks = {
  xs: 0,
  sm: 420,
  md: 900,
  lg: 1200,
}

const breakBump = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
}

const queries = {
  xs: `@media (max-width: ${breaks.sm - 1}px)`,
  sm: `@media (min-width: ${breaks.sm}px) and (max-width: ${breaks.md - 1}px)`,
  md: `@media (min-width: ${breaks.md}px) and (max-width: ${breaks.lg - 1}px)`,
  lg: `@media (min-width: ${breaks.lg}px)`,
  from: (breakPoint) => (`@media (min-width: ${breaks[breakPoint]}px)`),
  upTo: (breakPoint) => (`@media (max-width: ${breaks[ breakBump[breakPoint] ] - 1}px)`),
}

const theme = {
  colors,
  breaks,
  queries,
}

export default theme
