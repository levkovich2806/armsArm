import { Merchant } from "@/types/api"
import { Button, Form, Input, InputNumber } from "antd"
import { useEffect } from "react"

type Props = {
  data: Merchant | undefined
  onSubmit: (data: Merchant) => void
}

const MerchantForm = (props: Props) => {
  const { data, onSubmit } = props
  const isEdit = !!data

  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  return (
    <div>
      <h1>Merchant Form</h1>
      <Form onFinish={onSubmit} form={form}>
        <Form.Item label="Name" name="merchantName">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="Prepaid Period" name="prepaidPeriod">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Product Count" name="productCount">
          <InputNumber />
        </Form.Item>
        {!isEdit && (
          <Form.Item label="Fixed Payment Amount" name="fixedPaymentAmount">
            <InputNumber />
          </Form.Item>)
        }
        <Button type="primary" htmlType="submit">Save</Button>
      </Form >
    </div>
  )
}

export default MerchantForm