module.exports = ({ env }) => {
  const isProd = env === 'production'
  const isTest = env === 'test'

  console.log('testing craco config:', env)

  return {
    babel: {
      presets: [
        [
          '@emotion/css-prop',
          {
            useBuiltIns: true,
          }
        ]
      ],
      plugins: [
        [
          'emotion',
          {
            sourceMap: isProd ? false : !isTest,
          }
        ],
      ],
    }
  }
}