export function useQuery<T = string, Q = Record<string, any>>(key?: string, defaultValue?: T) {
  const query: Ref<Q> = ref({}) as Ref<Q>
  const value: Ref<T | undefined> = ref(defaultValue) as Ref<T | undefined>
  const onQueryEvent = createEventHook<[T, Q]>()
  const onLoadEvent = createEventHook<[Q]>()
  onLoad((q) => {
    if (q) {
      onLoadEvent.trigger(q as Q)
      query.value = q as Q
      if (q && key && q[key]) {
        value.value = decodeURIComponent(q[key]) as T
        onQueryEvent.trigger(value.value, query.value)
      }
    }
  })
  return {
    query,
    value,
    onQuery: onQueryEvent.on,
    onLoad: onLoadEvent.on,
  }
}
