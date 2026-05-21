export function navigateTo<R = Record<string, any>, P = Record<string, any>>(url: string, props?: P, events?: Record<string, (data: R) => void>) {
  return new Promise<UniApp.NavigateToSuccessOptions>((resolve, reject) => {
    uni.navigateTo({
      url,
      events,
      success: (res) => {
        if (props) {
          res.eventChannel.emit('props', toRaw(props))
        }
        resolve(res)
      },
      fail: reject,
    })
  })
}

export function switchTab(url: string) {
  return new Promise ((resolve, reject) => {
    uni.switchTab({
      url,
      success: resolve,
      fail: reject,
    })
  })
}
