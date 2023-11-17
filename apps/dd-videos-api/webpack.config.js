const { merge } = require('webpack-merge');
const webpack = require('webpack');

// const version = require('../../libs/version/dist');
module.exports = (config, context) => {
  return merge(config, {
    stats: {
      warningsFilter: /^(?!CriticalDependenciesWarning$)/,
    },
    // overwrite values here
    externals: [
      /^(@aws-sdk\/).*/i,
      {
        fsevents: "require('fsevents')",
      },
    ],
    plugins: [
      new webpack.DefinePlugin({
        API_VERSION: `"1.0.0"`,
      }),
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      }),
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            'bufferutil',
            'class-transformer/cjs/storage',
            'utf-8-validate',
            '@nestjs/websockets/socket-module',
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/platform-express',
            'class-validator',
            'class-transformer',
            'class-transformer/storage',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
    ],
  });
};
