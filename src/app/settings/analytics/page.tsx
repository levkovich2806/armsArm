'use client'

import { useCallback, useEffect, useState } from "react"
import { AnType, AnTypeResponse } from "@/types/api"
import { TableParamsChange } from "@/types/common"
import { makePageNavigator } from "@/utils/common"
import { analyticApi } from "@/services/analytic"
import AnTypeTable, { antypesExtraColumnProps } from "./components/Table"

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(false)

  const [anTypes, setAnTypes] = useState<AnTypeResponse>({
    countAll: 0,
    list: [],
  })

  const getAnTypeData = useCallback(async (tableParamsData: TableParamsChange<AnType>) => {
    setIsLoading(true)

    const pageNavigator = makePageNavigator<AnType>({
      tableParamsData,
      extraColumnProps: antypesExtraColumnProps,
    })

    analyticApi.getAnTypes(pageNavigator).then(r => {
      if (r) {
        setAnTypes(r)
      }
    })
    .finally(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    getAnTypeData({} as TableParamsChange<AnType>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTableParamsChange = useCallback(
    (params: TableParamsChange<AnType>) => {
      getAnTypeData(params)
    },
    [getAnTypeData]
  )

  return (
    <div>
      <h1>Аналитика</h1>
      <AnTypeTable
        data={anTypes.list}
        isLoading={isLoading}
        onTableParamsChange={handleTableParamsChange}
        total={anTypes.countAll}
        pageSize={10}
      />
    </div>
  )
} 