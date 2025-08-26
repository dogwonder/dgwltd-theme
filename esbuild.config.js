import * as esbuild from 'esbuild'

const isDev = process.env.NODE_ENV !== 'production'

await esbuild.build({
  entryPoints: ['src/assets/scripts/app.js'],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  target: ['es2020'],
  format: 'iife',
  outfile: 'dist/js/app.min.js',
  watch: isDev && {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
})