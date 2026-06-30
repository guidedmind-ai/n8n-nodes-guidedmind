const { src, dest, series } = require('gulp');

function copyIcons() {
  return src(['nodes/**/*.svg', 'nodes/**/*.png', 'credentials/**/*.svg', 'credentials/**/*.png'], { base: '.' })
    .pipe(dest('dist'));
}

exports.build = series(copyIcons);
exports['build:icons'] = copyIcons;
exports.default = copyIcons;
