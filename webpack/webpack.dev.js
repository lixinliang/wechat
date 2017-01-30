'use strict';

let fs = require('fs');
let path = require('path');
let fse = require('fs-extra');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const entry = require('./webpack.entry.json');
const packageJson = require('../package.json');

const alias = {};
const imageSize = 10240;
const sourcePath = path.join(__dirname, '../src');
const constant = {
    NAME : packageJson.name,
    VERSION : packageJson.version,
};

let config = {
    devtool : '#source-map',
    entry,
    output : {
        filename : 'js/[name].js',
        publicPath : '',
    },
    extensions : ['.vue', '.js', '.coffee', '.json', '.scss'],
    resolve : {
        alias,
    },
    module : {
        loaders : [
            {
                test : /\.vue$/,
                loader : 'vue',
            },
            {
                test : /\.html$/,
                loader : 'raw',
            },
            {
                test : /\.(png|jpg|gif|svg)$/,
                loader : `url?limit=${ imageSize }&name=../img/[name].[ext]?[hash]`,
            },
            {
                test : /\.css$/,
                loader : ExtractTextWebpackPlugin.extract('style', 'css!postcss'),
            },
            {
                test : /\.scss$/,
                loader : ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass'),
            },
            {
                test : /\.js$/,
                exclude : path.join(__dirname, '../node_modules/'),
                loader : 'babel',
                query : {
                    presets : ['es2015', 'stage-0'],
                    // plugins : ['transform-remove-strict-mode'],
                    // plugins: ['transform-runtime'],
                },
            },
            {
                test : /\.coffee/,
                loader : 'coffee',
            },
            {
                test : /\.(coffee\.md|litcoffee)$/,
                loader : 'coffee?literate',
            },
        ],
    },
    plugins : [
        new ExtractTextWebpackPlugin('css/[name].css'),
        new webpack.DefinePlugin((() => {
            Object.keys(constant).forEach(( key ) => {
                constant[key] = JSON.stringify(constant[key]);
            });
            return {
                'process.env' : constant,
            };
        })()),
    ],
    vue : {
        loaders : {
            sass : ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass'),
            scss : ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass'),
        },
    },
    postcss () {
        return [autoprefixer({ browsers : ['last 2 versions'] })];
    },
    devServer : {
        proxy : {
            '/' : {
                bypass ( req, res ) {
                    if (/^\/package\.json($|\?)/.test(req.url)) {
                        res.writeHead(200, { 'Content-Type' : 'application/json' });
                        res.end(getPackageJson());
                    } else {
                        return req.url;
                    }
                },
            },
        },
    },
};

function getPackageJson () {

    if (getPackageJson.result) {
        return getPackageJson.result;
    }

    let result = {};

    process.argv.forEach(( param ) => {
        if (/^--/.test(param)) {
            let temp = param.slice(2).split('=');
            let key = temp[0];
            let value = temp[1] || true;
            process.argv[key] = value;
        }
    });

    let version = ['x', 'x', 'x'];
    const regexp = /^((^|\.)(0|([1-9](\d+)?))){1,3}$/;
    if (process.argv.version && regexp.test(process.argv.version)) {
        process.argv.version.split('.').forEach(( value, index ) => {
            version[index] = value;
        });
    }

    let versionRegexp = version.slice();
    versionRegexp.forEach(( value, index ) => {
        if (value === 'x') {
            versionRegexp[index] = '(0|[1-9](\\d+)?)';
        }
    });
    versionRegexp = new RegExp('^' + versionRegexp.join('\\.') + '$');

    let packagePath = path.join(sourcePath, 'package');
    fs.readdirSync(packagePath).forEach(( packageVersion ) => {
        let packageVersionJs = path.join(packagePath, packageVersion, 'index.js');
        let packageVersionJson = path.join(packagePath, packageVersion, 'package.json');
        if (fs.existsSync(packageVersionJson) && fs.statSync(packageVersionJson).isFile()) {
            if (versionRegexp.test(packageVersion)) {
                result[packageVersion] = fse.readJsonSync(packageVersionJson);
                result[packageVersion]['timestamp'] = result[packageVersion]['timestamp'] || null;
            }
        }
    });

    return getPackageJson.result = JSON.stringify(result);

}

module.exports = config;
