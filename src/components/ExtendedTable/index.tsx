import { memo, useCallback, useMemo } from 'react'
import { Button, DatePicker, Input, Space, Table, TablePaginationConfig } from 'antd'
// import { User } from '../../types/users'
import { ColumnType } from 'antd/es/table'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import { ColumnProps, TableParamsChange } from '../../types/common'
import styles from './index.module.css'

type Props<T> = {
    data: T[]
    columns: unknown[]
    extraColumnsProps: Record<string, ColumnProps>
    rowKey: string
    onTableParamsChange?: (params: TableParamsChange<T>) => void
    isLoading?: boolean
    pagination?: false | TablePaginationConfig
}

type DataIndex = unknown //keyof User

function ExtendedTable<T extends object>(props: Props<T>) {
    const { pagination, data, columns, extraColumnsProps, rowKey, isLoading, onTableParamsChange } = props

    const handleParamsChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<T> | SorterResult<T>[],
            extra: TableCurrentDataSource<T>
        ) => {
            if (onTableParamsChange) {
                onTableParamsChange({
                    pagination,
                    filters,
                    sorter,
                    extra,
                })
            }
        },
        [onTableParamsChange]
    )

    const getColumnSearchProps = useCallback(
        (dataIndex: DataIndex): ColumnType => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div className={styles.filterContent} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className={styles.filterInput}
                    />
                    <Space>
                        <Button type='primary' onClick={() => confirm()} icon={<SearchOutlined />} size='small'>
                            Поиск
                        </Button>
                        <Button type='link' size='small' onClick={close}>
                            закрыть
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            filterDropdownProps: {
                onOpenChange: (visible) => {
                    console.log('onOpenChange', visible)
                }
            }
        }),
        []
    )

    const getColumnCalendarSearchProps = useCallback(
        (dataIndex: DataIndex): ColumnType => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => {
                return (
                    <div className={styles.filterContent} onKeyDown={e => e.stopPropagation()}>
                        <DatePicker
                            onChange={(date, dateString: string) => setSelectedKeys(dateString ? [dateString] : [])}
                            className={styles.filterInput}
                        />
                        <Space>
                            <Button type='primary' onClick={() => confirm()} icon={<SearchOutlined />} size='small'>
                                Поиск
                            </Button>
                            <Button type='link' size='small' onClick={close}>
                                закрыть
                            </Button>
                        </Space>
                    </div>
                )
            },
            filterIcon: (filtered: boolean) => <CalendarOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            filterDropdownProps: {
                onOpenChange: (visible) => {
                    console.log('onOpenChange', visible)
                }
            }
        }),
        []
    )

    const tableColumns = useMemo(() => {
        return columns.map(it => {
            // @ts-ignore
            const { key } = it

            // @ts-ignore
            if (key && extraColumnsProps[key.toString()]) {
                // @ts-ignore
                const { customFilter } = extraColumnsProps[key.toString()]
                if (customFilter) {
                    switch (customFilter) {
                        case 'simpleSearch':
                            return {
                                // @ts-ignore
                                ...it,
                                // @ts-ignore
                                ...getColumnSearchProps(it.key),
                            }
                        case 'dateSearch':
                            // @ts-ignore
                            return { ...it, ...getColumnCalendarSearchProps(it.key) }
                    }
                }
            }

            return it
        })
    }, [columns, extraColumnsProps, getColumnCalendarSearchProps, getColumnSearchProps])

    // @ts-ignore
    return (
        <Table
            scroll={{ x: 'max-content', y: 600 }}
            rowKey={rowKey}
            columns={tableColumns}
            dataSource={data}
            onChange={handleParamsChange}
            loading={isLoading}
            pagination={pagination}
        />
    )
}

const typedMemo: <T>(c: T) => T = memo
export default typedMemo(ExtendedTable)
