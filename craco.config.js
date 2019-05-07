module.exports = ({ env }) => {
  const isProd = env === 'production'
  const isTest = env === 'test'

  return {
    babel: {
      plugins: [
        [
          'emotion',
          {
            sourceMap: isProd ? false : !isTest,
          }
        ],
      ],
    },
  }
}