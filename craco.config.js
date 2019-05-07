const path = require('path')


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
    jest: {
      configure: {
        moduleNameMapper: {
          "^~(.*)$": "<rootDir>/src$1",
        }
      }
    },
    webpack: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      }
    }
  }
}