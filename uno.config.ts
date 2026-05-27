import { oiijPreset } from '@oiij/unocss-preset'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetWot } from '@wot-ui/unocss-preset'
import { defineConfig, presetIcons, presetTypography, presetWebFonts, transformerCompileClass, transformerDirectives, transformerVariantGroup } from 'unocss'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
  rules: [

  ],
  shortcuts: {

  },
  presets: [
    presetUni({
      attributify: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '1.2em',
        'height': '1.2em',
      },
      collections: {
        custom: FileSystemIconLoader('./src/static/icons/svg'),
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),

    oiijPreset(),
    presetWot(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
})
