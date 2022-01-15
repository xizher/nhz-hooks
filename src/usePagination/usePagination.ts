import { shallowReactive, toRefs, watchEffect } from 'vue'
import { get, MayBeRef } from '../base'

export type PaginationOptions = {
  pageSize?: number
  pageIndex?: number
}

export function usePagination <T> (
  source: MayBeRef<T[] | ((options: { returnTotal: (total: number) => void, pageSize: number, pageIndex: number }) => Promise<T[]>)>,
  { pageIndex = 0, pageSize = 20 } : PaginationOptions = {}
) {
  const pagination = shallowReactive<{
    pageIndex: number
    pageSize: number
    total: number
    data: T[]
  }>({
    pageIndex,
    pageSize,
    total: 0,
    data: []
  })
  watchEffect(async () => {
    const _source = get(source)
    if (Array.isArray(_source)) {
      const [startIndex, endIndex] = [
        pagination.pageSize * pagination.pageIndex,
        pagination.pageSize * (pagination.pageIndex + 1)
      ]
      pagination.data = _source.slice(startIndex, endIndex)
      pagination.total = _source.length
    } else {
      pagination.data = await _source({
        returnTotal: total => pagination.total = total,
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex,
      })
    }
  })

  return toRefs(pagination)
}
