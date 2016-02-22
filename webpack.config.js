var webpack = require('webpack');
var path = require('path');
var plugins = [
    new webpack.HotModuleReplacementPlugin()
];
var ENTRIES = {
    production: './src/xion/Xion.js',
    ui: './src/entry.js'
}

var OUTPUTS = {
    production: 'xion.min.js',
    ui: 'xion.ui.js'
}

if(process.env.STATE.toString().trim()=='production') plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));

module.exports = {
    entry: ENTRIES[process.env.STATE || 'ui'],
    output: {
        path: path.resolve(__dirname,'build'),
            filename: OUTPUTS[process.env.STATE.toString().trim() || 'ui']
    },
    plugins: plugins,
    module: {
        loaders: [
            { test: /\.js|\.es6$/, loader: 'babel-loader' },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    },
    exclude: ['/bower_components/','/node_modules/'],
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
};