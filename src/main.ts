import { createSSRApp } from 'vue'
import App from './App.vue'
import { useModules } from './modules'
import 'virtual:uno.css'
import '@unocss-applet/reset/uni-app/tailwind-compat.css'
import '@unocss-applet/reset/uni-app/button-after.css'

export function createApp() {
  const app = createSSRApp(App)
  useModules(app)

  return {
    app,
  }
}
