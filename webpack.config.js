 module.exports = {
   entry: './src/index.js',
   output: {
     path: './dist',
     filename: 'aframe-react.js',
   },
   module: {
     loaders: [{
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader'
     }]
   }
};
