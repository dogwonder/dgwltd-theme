import * as esbuild from 'esbuild'

const isDev = process.env.NODE_ENV !== 'production'

const options = {
  entryPoints: [
    'src/assets/scripts/app.js'
  ],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  target: ['es2020'],
  format: 'iife',
  outdir: 'dist/js',
  entryNames: '[name].min',
}

if (isDev) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('esbuild: watching for changes...')
} else {
  await esbuild.build(options)
  console.log('esbuild: build complete')
}