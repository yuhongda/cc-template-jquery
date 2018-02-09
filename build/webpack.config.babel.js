
var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    BomPlugin = require('webpack-utf8-bom'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    config = require('../config');
    
var _version = '20180205';

const pageList = [ 
    'index'
];

let entries = {},
    keys = [];
pageList.forEach(item => {
    const nameArray = item.split('-');
    const key = nameArray.length > 1 ? 
                nameArray.map((letter, i) => i > 0 ? letter.charAt(0).toUpperCase() + letter.slice(1) : letter).join('') : 
                nameArray[0];
    keys.push(key)
    if(process.env.NODE_ENV === 'production'){
        entries[key] = [`./src/js/pages/${item}.js`]
    }else{
        entries[key] = ['./build/dev-client' ,`./src/js/pages/${item}.js`]        
    }
})

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
        filename: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `js/[name].${_version}.js`)
            : path.posix.join(config.dev.assetsSubDirectory, `js/[name].${_version}.js`),
        chunkFilename: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `js/[name].chunk.js`)
            : path.posix.join(config.dev.assetsSubDirectory, `js/[name].chunk.js`)
    },
    resolve:{
        alias: {
            vue: 'vue/dist/vue.min.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'stage-2']
                        }
                    }
                ],
                
            },
            {
                test: /\.s[c|a]ss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                },{ 
                    loader: "postcss-loader"
                },{ 
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.(jpeg|jpg|png|gif)$/i,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? `url-loader?limit=10000&name=${ path.posix.join(config.build.assetsSubDirectory, 'images/[name].[ext]?[hash]') }`
                        : `url-loader?limit=10000&name=${ path.posix.join(config.dev.assetsSubDirectory, 'images/[name].[ext]?[hash]') }`,
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: false,//process.env.NODE_ENV === 'production',
                            gifsicle: {
                                interlaced: false
                            },
                            mozjpeg: {
                                progressive: true,
                                arithmetic: false
                            },
                            optipng: false, // disabled
                            pngquant: {
                                floyd: 0.5,
                                speed: 2
                            },
                            svgo: {
                                plugins: [
                                    { removeTitle: true },
                                    { convertPathData: false }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({fallback: 'css-loader', use: 'postcss-loader'})
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('css-loader!stylus-loader')        
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: [
                    process.env.NODE_ENV === 'production'
                    ? `url-loader?limit=20000&name=${ path.posix.join(config.build.assetsSubDirectory, 'fonts/[name].[ext]?[hash]') }`
                    : `url-loader?limit=20000&name=${ path.posix.join(config.dev.assetsSubDirectory, 'fonts/[name].[ext]?[hash]') }`
                ]
            },
            {
                test: /\.m.html$/,
                use: [
                    {
                        loader: 'eval-mustache-loader',
                        options: {}
                    }
                ]
            }
        ]
    }
}

module.exports.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        chunks: keys,
        minChunks: 3
    }),
    ...pageList.map((item, i) => new HtmlWebpackPlugin({ 
        favicon: './src/images/favicon.ico', 
        filename: `./${item}.html`, 
        template: `./src/${item}.html`,
        // inject: 'head',
        inject: true,
        hash: false,
        chunks: ['vendors', keys[i]],
        minify: { 
          removeComments: false, 
          collapseWhitespace: false
        }
    })),
    new ExtractTextPlugin(process.env.NODE_ENV === 'production'
        ? path.posix.join(config.build.assetsSubDirectory, `css/styles.css`)
        : path.posix.join(config.dev.assetsSubDirectory, `css/styles.css`)),
    new CopyWebpackPlugin([
        { from: './src/images/**', to: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `images/[name].[ext]`)
            : path.posix.join(config.dev.assetsSubDirectory, `images/[name].[ext]`) },
        { from: './src/js/libs/**', to: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `js/libs/[name].[ext]`)
            : path.posix.join(config.dev.assetsSubDirectory, `js/libs/[name].[ext]`) },
        { from: './src/css/libs/**', to: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `css/libs/[name].[ext]`)
            : path.posix.join(config.dev.assetsSubDirectory, `css/libs/[name].[ext]`) },
        { from: './node_modules/vue/dist/vue.min.js', to: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `js/libs/[name].[ext]`)
            : path.posix.join(config.dev.assetsSubDirectory, `js/libs/[name].[ext]`) },
        { from: './node_modules/vue-i18n/dist/vue-i18n.min.js', to: process.env.NODE_ENV === 'production'
            ? path.posix.join(config.build.assetsSubDirectory, `js/libs/[name].[ext]`)
            : path.posix.join(config.dev.assetsSubDirectory, `js/libs/[name].[ext]`) }
            
    ], {})
];

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]);
} else {
    // module.exports.devtool = 'eval-source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.HotModuleReplacementPlugin()    
    ]);
}
