import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
    },
  },
  pages: [],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'UniStarter',
    navigationStyle: 'default',
  },
  tabBar: {
    backgroundColor: '@tabBgColor',
    borderStyle: '@tabBorderStyle',
    color: '@tabFontColor',
    selectedColor: '@tabSelectedColor',
    list: [
      {
        pagePath: 'pages/index',
        text: '首页',
        iconPath: 'static/icons/png/SolarCatBroken.png',
        selectedIconPath: 'static/icons/png/SolarCatBold.png',
      },
      {
        pagePath: 'pages/echarts',
        text: 'ECharts',
        iconPath: 'static/icons/png/SolarCodeCircleBroken.png',
        selectedIconPath: 'static/icons/png/SolarCodeCircleBold.png',
      },
      {
        pagePath: 'pages/setting',
        text: '设置',
        iconPath: 'static/icons/png/SolarGamepadBroken.png',
        selectedIconPath: 'static/icons/png/SolarGamepadBold.png',
      },
    ],
  },
})
