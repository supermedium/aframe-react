// Karma configuration.
module.exports = function (config) {
  config.set({
    basePath: '../',
    browsers: ['Firefox', 'Chrome'],
    client: {
      captureConsole: true,
      mocha: {ui: 'tdd'}
    },
    files: [
      // Define test files.
      {pattern: 'browser/**/*.test.js'}
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal'],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'browser/**/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'react', 'stage-0']
              }
            }
          }
        ]
      }
    }
  });
};
