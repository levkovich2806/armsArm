import React, { useMemo } from 'react'
import { Tag } from 'antd'
import { ColumnProps, TableParamsChange } from '@/types/common'
import { AnType } from '@/types/api'
import { addFiltersDataToColumns } from '@/utils/common'
import ExtendedTable from '@/components/ExtendedTable'
import { ColumnType } from "antd/es/table"

type AnTypeTableProps = {
  data: AnType[]
  isLoading: boolean
  onTableParamsChange: (params: TableParamsChange<AnType>) => void
  total: number
  pageSize?: number
}

export const antypesExtraColumnProps: Record<string, ColumnProps>  = {
  anType: {
    customFilter: 'simpleSearch',
    valueType: 'number',
  },
  anTypeName: {
    customFilter: 'simpleSearch',
    valueType: 'string',
  },
  isOpen: {
    customFilter: 'simpleSearch',
    valueType: 'array',
  },
}

export default function AnTypeTable(props: AnTypeTableProps) {
  const { data, isLoading, onTableParamsChange, total, pageSize = 10 } = props


  const columns: ColumnType<AnType>[] = [
    {
      title: 'ID',
      dataIndex: 'anType',
      key: 'anType',
      sorter: true,
    },
    {
      title: 'Название',
      dataIndex: 'anTypeName',
      key: 'anTypeName',
      sorter: true,
    },
    {
      title: 'Статус',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => (
        <Tag color={isOpen ? 'green' : 'red'}>
          {isOpen ? 'Открыт' : 'Закрыт'}
        </Tag>
      ),
      filters: [
        { text: 'Открыт', value: true },
        { text: 'Закрыт', value: false },
      ],
    },
  ]

  const extraColumnPropsWithFiltersData = useMemo(() => {
    return addFiltersDataToColumns<AnType>(antypesExtraColumnProps, props)
  }, [props])

  return (
    <ExtendedTable<AnType>
      rowKey={'anType'}
      data={data}
      columns={columns}
      extraColumnsProps={extraColumnPropsWithFiltersData}
      pagination={{
        pageSize,
        total,
        showSizeChanger: true,
      }}
      isLoading={isLoading}
      onTableParamsChange={onTableParamsChange}
    />
  )
} 