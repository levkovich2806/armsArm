import { ColumnProps, TableParamsChange } from '@/types/common'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Space, Table, TablePaginationConfig } from 'antd'
import { ColumnType } from 'antd/es/table'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import { memo, useCallback, useMemo } from 'react'
import styles from './index.module.css'

type Props<T> = {
    data: T[]
    columns: ColumnType<T>[]
    extraColumnsProps: Record<string, ColumnProps<T>>
    rowKey: string
    onTableParamsChange?: (params: TableParamsChange<T>) => void
    isLoading?: boolean
    pagination?: false | TablePaginationConfig
}

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
        (): ColumnType => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
                <div className={styles.filterContent} onKeyDown={e => e.stopPropagation()}>
                    <Input
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
            const { key } = it

            if (key && extraColumnsProps[key.toString()]) {
                const { customFilter } = extraColumnsProps[key.toString()]
                if (customFilter) {
                    switch (customFilter) {
                        case 'simpleSearch':
                            return {
                                ...it,
                                ...getColumnSearchProps(),
                            }
                        case 'dateSearch':
                            return { ...it, ...getColumnCalendarSearchProps() }
                    }
                }
            }

            return it
        })
    }, [columns, extraColumnsProps, getColumnCalendarSearchProps, getColumnSearchProps])

    return (
        <Table
            scroll={{ x: 'max-content', y: 600 }}
            rowKey={rowKey}
            columns={tableColumns as unknown as ColumnType<T>[]}
            dataSource={data}
            onChange={handleParamsChange}
            loading={isLoading}
            pagination={pagination}
        />
    )
}

const typedMemo: <T>(c: T) => T = memo
export default typedMemo(ExtendedTable)
