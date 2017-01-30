'use strict';

let fs = require('fs');
let path = require('path');
let fse = require('fs-extra');
let moment = require('moment');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let HtmlInlineSourceWebpackPlugin = require('html-inline-source-webpack-plugin');

const entry = require('./webpack.entry.json');
const packageJson = require('../package.json');

const alias = {};
const imageSize = 10240 * 2;
const sourcePath = path.join(__dirname, '../src');
const constant = {
    NODE_ENV : 'production',
    NAME : packageJson.name,
    VERSION : packageJson.version,
    MANIFEST : 'manifest.appcache',
    TIMESTAMP : moment().format('YYYY-MM-DD h:mm:ss a'),
};

const banner =
`@ProjectName ${ packageJson.name }
@Version ${ packageJson.version }
@Author ${ packageJson.author.name }(${ packageJson.author.url })
@Update ${ moment().format('YYYY-MM-DD h:mm:ss a') }`;

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

let config = {
    entry,
    output : (() => {
        if (process.argv.build == 'js') {
            return {
                path : './dist/',
                filename : `[name]${ process.argv.uglify ? '.min' : '' }.js`,
                library : process.argv.library,
                libraryTarget : process.argv.libraryTarget,
            };
        } else {
            return {
                path : './dist/',
                filename : 'js/[name].js',
                publicPath : '',
            };
        }
    })(),
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
                test : /\.(png|jpg|gif|svg)$/,
                loader : `url?limit=${ imageSize }&name=${ process.argv.build == 'js' ? '../' : '' }img/[name].[ext]?[hash]`,
            },
            {
                test : /\.css$/,
                loader : process.argv.build == 'js' ? 'css!postcss' : ExtractTextWebpackPlugin.extract('style', 'css!postcss'),
            },
            {
                test : /\.scss$/,
                loader : process.argv.build == 'js' ? 'css!postcss!sass' : ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass'),
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
        new webpack.DefinePlugin((() => {
            let result = {};
            Object.keys(constant).forEach(( key ) => {
                result[key] = JSON.stringify(constant[key]);
            });
            return {
                'process.env' : result,
            };
        })()),
        new webpack.BannerPlugin(banner),
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
};

let plugins = config.plugins;
if (process.argv.build == 'js') {
    if (process.argv.uglify) {
        plugins.unshift(new webpack.optimize.UglifyJsPlugin({
            compress : {
                warnings : false,
            },
            output : {
                comments : false,
            },
        }));
    } else {
        plugins.unshift(new CleanWebpackPlugin(['dist'], {
            root : path.join(__dirname, '..'),
        }));
    }
} else {
    plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        compress : {
            warnings : false,
        },
        output : {
            comments : false,
        },
    }));
    plugins.unshift(new CopyWebpackPlugin((() => {
        let result = [];
        fs.readdirSync(sourcePath).forEach(( filename ) => {
            let file = path.join(sourcePath, filename);
            if (filename[0] === '.') {
                return;
            }
            let stats = fs.statSync(file);
            if (stats.isDirectory()) {
                if (filename == 'entry') {
                    return;
                }
                if (filename == 'package') {
                    return;
                }
            }
            if (stats.isFile()) {
                if (path.extname(file) == '.html') {
                    return;
                }
                if (path.extname(file) == '.appcache') {
                    return;
                }
            }
            result.push({
                from : file,
                to : filename,
            });
        });
        return result;
    })()));
    plugins.unshift(new CleanWebpackPlugin(['dist'], {
        root : path.join(__dirname, '..'),
    }));
    plugins.push(new ExtractTextWebpackPlugin('css/[name].css'));
    fs.readdirSync(sourcePath).forEach(( filename ) => {
        let template = path.join(sourcePath, filename);
        if (/\.(appcache|html)$/.test(filename)) {
            plugins.push(new HtmlWebpackPlugin({
                minify : false,
                inject : false,
                filename,
                template,
            }));
        }
    });
    plugins.push(new HtmlInlineSourceWebpackPlugin(() => {
        let distPath = path.join(sourcePath, '../dist');
        fse.writeJsonSync(path.join(distPath, 'package.json'), getPackageJson());
        fs.readdirSync(path.join(distPath, 'js', 'package')).forEach(( filename ) => {
            let jsPath = path.join(distPath, 'js', 'package', filename);
            let cssPath = path.join(distPath, 'css', 'package', `${ path.basename(filename, '.js') }.css`);
            fse.copySync(jsPath, path.join(distPath, 'package', filename));
            fse.copySync(cssPath, path.join(distPath, 'package', `${ path.basename(filename, '.js') }.css`));
            // let js = fs.readFileSync(jsPath, 'utf8');
            // let css = fs.readFileSync(cssPath, 'utf8');
            // fs.writeFileSync(path.join(distPath, 'package', filename), js, 'utf8');
            // fs.writeFileSync(path.join(distPath, 'package', `${ path.basename(filename, '.js') }.css`), css, 'utf8');
        });
        fse.remove(path.join(distPath, 'js'));
        fse.remove(path.join(distPath, 'css'));
    }));
}

function getPackageJson () {

    if (getPackageJson.result) {
        return getPackageJson.result;
    }

    let result = {};

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
                if (!result[packageVersion]['timestamp']) {
                    result[packageVersion]['timestamp'] = +new Date;
                    fse.writeJsonSync(packageVersionJson, result[packageVersion]);
                }
            } else {
                let json = fse.readJsonSync(packageVersionJson);
                if (json['timestamp']) {
                    result[packageVersion] = json;
                }
            }
        }
    });

    return getPackageJson.result = result;

}

module.exports = config;
