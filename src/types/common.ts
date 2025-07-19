import { TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'

export type TableParamsChange<T> = {
    pagination: TablePaginationConfig
    filters: Record<string, FilterValue | null>
    sorter: SorterResult<T> | SorterResult<T>[]
    extra: TableCurrentDataSource<T>
}

export type ColumnProps<T = object> = {
    customFilter?: CustomFilter
    valueType?: ValueType
    filterDataKey?: keyof T //По этому ключу берем из props компонента
    filterData?: TableDataParams[]
}

export type TableDataParams = {
    value: number
    text: number | string
}

export type ValueType = 'string' | 'number' | 'array'

export type CustomFilter = 'simpleSearch' | 'dateSearch'

export type DataType<T> = {
    key: string
} & T
