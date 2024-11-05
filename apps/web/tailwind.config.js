// const baseConfig = require('../../tailwind.config');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const _ = require('lodash');

/** @type {import('tailwindcss').Config} */
module.exports = _.mergeWith({
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
});
