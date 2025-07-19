import ExtendedTable from "@/components/ExtendedTable"
import { Merchant, MerchantResponse } from "@/types/api"
import { ColumnProps, TableParamsChange } from "@/types/common"
import { addFiltersDataToColumns } from "@/utils/common"
import { Button, Modal, Space } from "antd"
import { useMemo, useState } from "react"
import CloseReasonForm from "./CloseReasonForm"
import { ColumnType } from "antd/es/table"

type Props = {
  data: MerchantResponse['list']
  isLoading: boolean
  onTableParamsChange: (params: TableParamsChange<Merchant>) => void
  total: number
  pageSize: number
  onEdit: (merchantId: number) => void
  onClose: (merchantId: number, reason: string) => void
}

export const merchantsExtraColumnProps: Record<string, ColumnProps> = {
  merchantId: {
    customFilter: 'simpleSearch',
    valueType: 'number',
  },
  merchantName: {
    customFilter: 'simpleSearch',
    valueType: 'string',
  },
  dateOpen: {
    customFilter: 'dateSearch',
    valueType: 'string',
  },
  dateClose: {
    customFilter: 'dateSearch',
    valueType: 'string',
  },
  description: {
    customFilter: 'simpleSearch',
    valueType: 'string',
  },
  prepaidPeriod: {
    customFilter: 'simpleSearch',
    valueType: 'number',
  },
  productCount: {
    customFilter: 'simpleSearch',
    valueType: 'number',
  },
}

const MerchantTable = (props: Props) => {
  const { data, isLoading, onTableParamsChange, total, pageSize, onEdit, onClose } = props
  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false)
  const [merchantId, setMerchantId] = useState<number | null>(null)

  const columns: ColumnType<Merchant>[] = [
    {
      title: 'ID',
      dataIndex: 'merchantId',
      key: 'merchantId',
      sorter: (a: Merchant, b: Merchant) => a.merchantId - b.merchantId,
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 100,
      sorter: (a: Merchant, b: Merchant) => a.merchantName.localeCompare(b.merchantName),
    },
    {
      title: 'Date Open',
      dataIndex: 'dateOpen',
      key: 'dateOpen',
      width: 100,
      sorter: (a: Merchant, b: Merchant) => a.dateOpen?.localeCompare(b.dateOpen ?? '') ?? 0,
    },
    {
      title: 'Date Close',
      dataIndex: 'dateClose',
      key: 'dateClose',
      width: 100,
      sorter: (a: Merchant, b: Merchant) => a.dateClose?.localeCompare(b.dateClose ?? '') ?? 0,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100,
      sorter: (a: Merchant, b: Merchant) => a.description.localeCompare(b.description) ?? 0,
    },
    {
      title: 'Prepaid Period',
      dataIndex: 'prepaidPeriod',
      key: 'prepaidPeriod',
      // width: 100,
      sorter: (a: Merchant, b: Merchant) => a.prepaidPeriod - b.prepaidPeriod,
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
      key: 'productCount',
      // width: 100,
      sorter: (a: Merchant, b: Merchant) => a.productCount - b.productCount,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: unknown, record: Merchant) => {
        return (
          <Space>
            <Button type='link' onClick={() => onEdit(record.merchantId)}>Edit</Button>
            {!record.dateClose && (
              <Button type='link' onClick={() => {
                setMerchantId(record.merchantId)
                setIsCloseModalVisible(true)
              }}>Close</Button>
            )}
          </Space>
        )
      }
    }
  ]

  const extraColumnPropsWithFiltersData = useMemo(() => {
    return addFiltersDataToColumns<Merchant>(merchantsExtraColumnProps, props)
  }, [props])

  const handleCloseMerchant = (merchantId: number, reason: string) => {
    onClose(merchantId, reason)
    setIsCloseModalVisible(false)
  }

  return (
    <div>
      <ExtendedTable<Merchant>
        rowKey={'merchantId'}
        data={data}
        columns={columns}
        extraColumnsProps={extraColumnPropsWithFiltersData}
        isLoading={isLoading}
        onTableParamsChange={onTableParamsChange}
        pagination={{
          total,
          pageSize,
        }}
      />
      <Modal
        open={isCloseModalVisible}
        onCancel={() => setIsCloseModalVisible(false)}
        closable={true}
        destroyOnHidden={true}
        footer={null}
      >
        {merchantId ? <CloseReasonForm onSubmit={handleCloseMerchant} merchantId={merchantId} /> : null}
      </Modal>
    </div>
  )
}

export default MerchantTable