import type { UseInfiniteData, UseInfiniteScrollOptions } from 'vue-hooks-plus/es/useInfiniteScroll/types'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import useInfiniteScroll from 'vue-hooks-plus/es/useInfiniteScroll'

export type AutoLoadDataOptions<P extends Record<string, any>, R extends UseInfiniteData> = {
  defaultParams: Partial<P>
  infiniteScrollOptions?: UseInfiniteScrollOptions<R> | undefined
}
export function useAutoLoadData<P extends Record<string, any>, R extends UseInfiniteData>(service: (param: P) => Promise<R>, options?: UseInfiniteScrollOptions<R>) {
  const paramsRef = ref({
    page: 1,
    limit: 20,
    query: '',
  })
  const result = useInfiniteScroll<R>((data) => {
    paramsRef.value.page = data ? Math.ceil(data.list.length / paramsRef.value.limit) + 1 : 1
    return service(paramsRef.value as P)
  }, options)
  const hasMore = computed(() => result.data.value && (result.data?.value.list.length < result.data?.value.total))
  const total = computed<number>(() => result.data.value?.total || 0)
  const list = computed<R>(() => result.data.value?.list || [])

  function handleSearch(val: string) {
    paramsRef.value.query = val
    result.reload()
  }
  onPullDownRefresh(() => {
    paramsRef.value.page = 1
    result.reloadAsync().finally(() => {
      uni.stopPullDownRefresh()
    })
  })
  onReachBottom(() => {
    if (hasMore.value)
      result.loadMore()
  })
  return {
    ...result,
    hasMore,
    total,
    list,
    handleSearch,
    params: paramsRef as Ref<P>,
  }
}
