var webpack = require('webpack');
var path = require('path');

var state = process.env.STATE&&process.env.STATE.toString() || 'dev';

var ENTRIES = {
    'dev': './src/xion.dev.js',
    'pure': './src/xion.entry.js',
    'es6': './src/xion.entry.es6.js',
    'ui': './src/xion.entry.ui.js'
}

var OUTPUTS = {
    'dev': 'xion.dev.js',
    'pure': 'xion.min.js',
    'es6': 'xion.min.es6.js',
    'ui': 'xion.min.ui.js'
}

var cssLoaderStates = ['dev','ui'];

var plugins = [];
if(/dev/.test(state)) plugins.push(new webpack.HotModuleReplacementPlugin());
if(!/dev/.test(state)) plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));

var loaders = [
    { test: /\.js|\.es6$/, loader: 'babel-loader' }
];
if(cssLoaderStates.indexOf(state)!=-1) loaders.push({ test: /\.css$/, loader: "style-loader!css-loader" });

var webpackConfig = {
    entry: ENTRIES[state],
    output: {
        path: path.resolve(__dirname,'build'),
        filename: OUTPUTS[state]
    },
    plugins: plugins,
    module: {
        loaders: loaders
    }
}
if(/dev/.test(state)) {
    webpackConfig.exclude = ['/bower_components/','/node_modules/'];
    webpackConfig.devServer = {
        contentBase: './build',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
}

module.exports = webpackConfig;