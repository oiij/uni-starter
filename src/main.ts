import { createSSRApp } from 'vue'
import App from './App.vue'
import { useModules } from './modules'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  useModules(app)

  return {
    app,
  }
}
