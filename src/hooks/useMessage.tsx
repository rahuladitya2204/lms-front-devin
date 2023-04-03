import { message } from 'antd'

const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  return messageApi
}

export default useMessage
