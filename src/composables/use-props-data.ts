export function usePropsData<T>() {
  const dataRef = ref<T>()
  const { eventChannel } = useUniEventChannel()
  const onLoadEvent = createEventHook<[T | undefined]>()
  function setPropsData(data?: T) {
    dataRef.value = data
    onLoadEvent.trigger(data)
  }
  onLoad(() => {
    eventChannel?.on<T>('props', setPropsData)
  })
  onUnmounted(() => {
    eventChannel?.off<T>('props', setPropsData)
  })
  return {
    data: dataRef,
    onLoadProps: onLoadEvent.on,
  }
}
