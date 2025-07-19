import { FilterList, PageNavigator, SortList } from '@/types/api'
import { ColumnProps, TableParamsChange } from '@/types/common'

export const makeQueryAndFilters = <T>({
    tableParamsData,
    extraColumnProps,
}: {
    tableParamsData: TableParamsChange<T>
    extraColumnProps: Record<string, ColumnProps<T>>
}) => {
    const { filters, pagination, sorter } = tableParamsData

    const query = {
        skip: 0,
        count: Number(process.env.NEXT_PUBLIC_DEFAULT_TABLE_PAGE_SIZE) || 10,
    } as Query

    if (sorter) {
        query.sort_field = !Array.isArray(sorter) ? sorter.columnKey?.toString() : undefined
        query.sort_order = !Array.isArray(sorter)
            ? sorter.order === 'ascend'
                ? 1
                : sorter.order === 'descend'
                ? -1
                : undefined
            : undefined
    }

    if (pagination) {
        query.count = Number(pagination.pageSize)
        query.skip = (pagination.current && pagination.pageSize && (pagination.current - 1) * pagination.pageSize) ?? 0
    }

    const filter = Object.keys(filters ?? {}).reduce((rest, key) => {
        const filterValue = filters[key]
        const { valueType } = extraColumnProps[key] || {}

        if (filterValue) {
            if (valueType !== 'array') {
                const value = filterValue[0]
                rest[key] = valueType === 'number' ? Number(value) : value
            } else {
                rest[key] = filterValue
            }
        }

        return rest
    }, {} as Record<string, unknown>)

    return {
        filter,
        query,
    }
}

export const makePageNavigator = <T>({
    tableParamsData,
    extraColumnProps,
}: {
    tableParamsData: TableParamsChange<T>
    extraColumnProps: Record<string, ColumnProps<T>>
}): PageNavigator => {
    const { pagination, filters, sorter } = tableParamsData

    const pageNum = pagination?.current ?? 1
    const pageSize = pagination?.pageSize ?? 10

    const filterList = Object.keys(filters ?? {}).map((key) => {
        const filterValue = filters[key]
        const { valueType } = extraColumnProps[key] || {}

        if (filterValue) {
            if (valueType !== 'array') {
                const value = filterValue[0]
                return {
                    field: key,
                    oper: valueType === 'number' ? 'IN' : '%LIKE%',
                    values: valueType === 'number' ? [Number(value)] : [value],
                    isCaseSensitive: 0,
                }
            } else {
                return {
                    field: key,
                    oper: 'IN',
                    values: filterValue,
                    isCaseSensitive: 0,
                }
            }
        }
    }).filter(Boolean) as FilterList[]

    const sortList = sorter ? (
        Array.isArray(sorter) 
            ? sorter.length > 0 && sorter[0].columnKey 
                ? [{
                    field: sorter[0].columnKey.toString(),
                    order: sorter[0].order === 'ascend' ? 'ASC' : 'DESC',
                  }] 
                : []
            : sorter.columnKey 
                ? [{
                    field: sorter.columnKey.toString(),
                    order: sorter.order === 'ascend' ? 'ASC' : 'DESC',
                  }]
                : []
    ) : [] as SortList[]


    return {
        pageNum,
        pageSize,
        filter: {
            list: filterList,
        },
        sort: {
            sortList
        }
    }
}

export const addFiltersDataToColumns = <T = object, P extends Record<string, unknown> = Record<string, unknown>>(
  extraColumnProps: Record<string, ColumnProps<T>>, 
  props: P
): Record<string, ColumnProps<T>> => {
    return Object.keys(extraColumnProps).reduce((rest, key) => {
        const filter = extraColumnProps[key]

        rest[key] = {
            ...filter,
        }

        if (filter.filterDataKey && typeof filter.filterDataKey === 'string') {
            const filterData = props[filter.filterDataKey as keyof P] as { id: number; name: string }[] | undefined
            rest[key].filterData = (filterData ?? []).map((it: { id: number; name: string }) => {
                return {
                    value: it.id,
                    text: it.name,
                }
            })
        }

        return rest
    }, {} as Record<string, ColumnProps<T>>)
}

export type Query = {
    skip?: number
    count?: number
    sort_field?: string
    sort_order?: 1 | -1
}

export const addQueryToUrl = (url: string, query: Query) => {
    const { skip, count, sort_order, sort_field } = query

    if (!url.includes('?')) {
        url += '?'
    }
    // else {
    //     url += '&'
    // }

    if (typeof skip !== 'undefined') {
        if (!url.endsWith('?')) {
            url += '&'
        }
        url += `skip=${skip}`
    }

    if (typeof count !== 'undefined') {
        if (!url.endsWith('?')) {
            url += '&'
        }
        url += `count=${count}`
    }

    if (typeof sort_field !== 'undefined') {
        if (!url.endsWith('?')) {
            url += '&'
        }
        url += `sort_field=${sort_field}`
    }

    if (typeof sort_order !== 'undefined') {
        if (!url.endsWith('?')) {
            url += '&'
        }
        url += `sort_order=${sort_order}`
    }

    return url
}