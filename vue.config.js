const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: true, // Abre automáticamente el navegador
  },
};
