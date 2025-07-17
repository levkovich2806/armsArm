import { Button, Form, Input } from "antd"
import { useCallback } from "react";

type Props = {
  merchantId: number
  onSubmit: (merchantId: number, reason: string) => void
}

const CloseReasonForm = (props: Props) => {
  const { merchantId, onSubmit } = props

  const handleSubmit = useCallback((values: { reason: string }) => {
    onSubmit(merchantId, values.reason)
  }, [merchantId, onSubmit])

  return (
    <div>
      <h1>Close Reason</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Reason" name="reason">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form>
    </div>
  )
}

export default CloseReasonForm