export default {
  plugins: {
    autoprefixer: {},
    'postcss-custom-properties': {},
    cssnano: {
      preset: ['default', {
        // Disable calc() processing entirely to preserve modern CSS units like 'cap'
        calc: false
      }]
    }
  }
};