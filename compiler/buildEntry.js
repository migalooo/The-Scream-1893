'use strict'
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const getEnvrionmentConfig = require('./utils/getEnvrionmentConfig.js')
const webpackConfig = require('./webpack.build.config.js')

let info, config = getEnvrionmentConfig() 
switch (config.env) {
  case 'production':
    info = 'production envrionment ...'
    break 
  case 'preproduction':
    info = 'preproduction envrionment ...'
    break
  default:
    process.exit(1)
}

const spinner = ora('building for ' + info)
spinner.start()

rm(path.join(config.assetsRoot, config.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan(`  ${config.env.replace(/^\w/, w => w.toUpperCase())} build complete.\n`))
  })
})

