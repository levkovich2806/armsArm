import { ColumnProps, TableParamsChange } from '@/types/common'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Space, Table, TablePaginationConfig } from 'antd'
import { ColumnType } from 'antd/es/table'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import { memo, useCallback, useMemo } from 'react'
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
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
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
        (): ColumnType => ({
            filterDropdown: ({ setSelectedKeys, confirm, close }) => {
                return (
                    <div className={styles.filterContent} onKeyDown={e => e.stopPropagation()}>
                        <DatePicker
                            onChange={(date, dateString: string | string[]) => setSelectedKeys(typeof dateString === 'string' && dateString ? [dateString] : [])}
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
            // @ts-expect-error - key is not defined in the ColumnProps type
            const { key } = it

            // @ts-expect-error - key is not defined in the ColumnProps type
            if (key && extraColumnsProps[key.toString()]) {
                // @ts-expect-error - key is not defined in the ColumnProps type
                const { customFilter } = extraColumnsProps[key.toString()]
                if (customFilter) {
                    switch (customFilter) {
                        case 'simpleSearch':
                            return {
                                // @ts-expect-error - key is not defined in the ColumnProps type
                                ...it,
                                // @ts-expect-error - key is not defined in the ColumnProps type
                                ...getColumnSearchProps(it.key),
                            }
                        case 'dateSearch':
                            // @ts-expect-error - key is not defined in the ColumnProps type
                            return { ...it, ...getColumnCalendarSearchProps(it.key) }
                    }
                }
            }

            return it
        })
    }, [columns, extraColumnsProps, getColumnCalendarSearchProps, getColumnSearchProps])

    // @ts-expect-error - rowKey is not defined in the TableProps type
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
