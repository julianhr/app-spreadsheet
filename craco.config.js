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
    eslint: {
      configure: {
        rules: {
          'no-unused-vars': [
            'error',
            {
              'argsIgnorePattern': '^_$"',
              'varsIgnorePattern': '^(_|jsx)$',
            }
          ],
          'react/display-name': false,
          'semi': [
            'error',
            'never',
          ]
        }
      }
    },
    jest: {
      configure: (jestConfig, { rootDir }) => {
        return {
          ...jestConfig,
          clearMocks: true,
          coveragePathIgnorePatterns: [
            ...(jestConfig.coveragePathIgnorePatterns || []),
            'src/styles/',
          ],
          moduleNameMapper: {
            ...(jestConfig.moduleNameMapper || {}),
            '^~(.*)$': '<rootDir>/src$1',
          },
          restoreMocks: true,
          roots: [
            ...(jestConfig.roots || []),
            '<rootDir>/src'
          ],
          setupFilesAfterEnv: [
            ...(jestConfig.setupFilesAfterEnv || []),
            './jest_configs/jestExtendConfig.js',
          ],
          testMatch: [
            '**/__tests__/**/*\\.(test|spec)\\.js',
          ],
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