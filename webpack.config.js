// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path'); //Absolute path to root directory
const fs = require('fs'); //file system module

//Default Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const stylesHandler = MiniCssExtractPlugin.loader;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//Optimization Plugins
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

//Find all html files for HTMLWebpackPlugin
var htmlFiles = [];
var directories = ['src'];
while (directories.length > 0) {
    var directory = directories.pop();
    var dirContents = fs.readdirSync(directory)
        .map(file => path.join(directory, file));

    htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
    directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

const isProduction = process.env.NODE_ENV == 'production'; //Production Mode

//Config
const config = {
    entry: './src/index.ts', //Entry Point
    output: { //Output
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/bundle-[contenthash].js'
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        //Handles all found HTML files for easier bundling
        ...htmlFiles.map(htmlFile =>
            new HtmlWebpackPlugin({
                template: htmlFile,
                filename: htmlFile.replace(path.normalize("src/"), ""),
        })),
        //Handles the CSS bundle
        new MiniCssExtractPlugin({
            //adding contenthash will help browsers pickup new code even when caching
            filename: "css/bundle-[contenthash].css", 
        }),
        //Will clean the output path before building
        new CleanWebpackPlugin(),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            //Handles HTML files
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            //Handles Typescript files
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            //Handles Sass and CSS files
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            //Handles image assets
            {
                test: /\.(eot|woff|woff2|png|jpg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[name]-[hash][ext][query]'
                }
            },
            //Handle SVG files to be inline
            {
                test: /\.svg/,
                type: 'asset/inline'
            },
            //Handle ttf files
            {
                test: /\.ttf/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name]-[hash][ext][query]'
                }
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    //Handles code optimization
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false, //Whether comments withing TS files are extracted
            }),
            new CssMinimizerPlugin(),
        ],
      },
};

//Export for development or production this is where the config above will be returned
module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
