'use client'

import { useCallback, useEffect, useState } from "react"
import { merchantApi } from "../../../services/merchant"
import { MerchantCreateRequest, Merchant, MerchantResponse, MerchantUpdateRequest } from "@/types/api"
import MerchantTable from "./components/Table"
import { Button, Modal } from "antd"
import MerchantForm from "./components/Form"
import { TableParamsChange } from "@/types/common"
import { makePageNavigator } from "@/utils/common"
import { merchantsExtraColumnProps } from "./components/Table"

export default function MerchantPage() {
  const [current, setCurrent] = useState<Merchant>()
  const [merchantModalVisible, setMerchantModalVisible] = useState(false)
  const [tableParams, setTableParams] = useState<TableParamsChange<Merchant>>({} as TableParamsChange<Merchant>)
  const [isLoading, setIsLoading] = useState(false)

  console.log(tableParams)

  const [merchants, setMerchants] = useState<MerchantResponse>({
    countAll: 0,
    list: [],
  })

  const toggleMerchantModal = useCallback(() => {
    setMerchantModalVisible((visible) => !visible)
  }, [])

  const getMerchantData = useCallback(async (tableParamsData: TableParamsChange<Merchant>) => {
    setIsLoading(true)

    const pageNavigator = makePageNavigator<Merchant>({
      tableParamsData,
      extraColumnProps: merchantsExtraColumnProps,
    })

    merchantApi.getMerchants(pageNavigator).then(r => {
      if (r) {
        setMerchants(r)
      }
    })
      .finally(() => {
        setIsLoading(false)
      })

    // const response = await merchantApi.getMerchants(tableParamsData)

    // setMerchants(response)
  }, [])

  useEffect(() => {
    getMerchantData({} as TableParamsChange<Merchant>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEdit = useCallback((merchantId: number) => {
    merchantApi.getMerchant(merchantId).then((merchant) => {
      setCurrent(merchant)
      toggleMerchantModal()
    })
  }, [toggleMerchantModal])

  const handleClose = useCallback((merchantId: number, reason: string) => {
    merchantApi.closeMerchant(merchantId, reason).then(() => getMerchantData(tableParams))
  }, [getMerchantData, tableParams])

  const handleAdd = useCallback(() => {
    setCurrent(undefined)
    toggleMerchantModal()
  }, [toggleMerchantModal])


  const handleSubmit = useCallback((data: MerchantCreateRequest | MerchantUpdateRequest) => {
    const afterSubmit = () => {
      toggleMerchantModal()
      getMerchantData(tableParams)
    }

    if (current) {
      merchantApi.updateMerchant(current.merchantId, data).then(afterSubmit)
    } else {
      if ('fixedPaymentAmount' in data) {
        merchantApi.createMerchant(data).then(afterSubmit)
      }
    }
  }, [current, getMerchantData, tableParams, toggleMerchantModal])

  const handleTableParamsChange = useCallback(
    (params: TableParamsChange<Merchant>) => {
      getMerchantData(params)
      setTableParams(params)
    },
    [getMerchantData]
  )

  return (
    <div>
      <Button type={'primary'} onClick={handleAdd}>
        Добавить
      </Button>
      <MerchantTable
        data={merchants.list}
        isLoading={isLoading}
        onTableParamsChange={handleTableParamsChange}
        total={merchants.countAll}
        pageSize={10}
        onEdit={handleEdit}
        onClose={handleClose}
      />
      <Modal
        width={1000}
        open={merchantModalVisible}
        closable={true}
        destroyOnHidden={true}
        onCancel={toggleMerchantModal}
        footer={null}
      >
        <MerchantForm data={current} onSubmit={handleSubmit} />
      </Modal>
    </div>
  )
}