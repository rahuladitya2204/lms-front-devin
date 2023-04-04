import { message } from 'antd'

const useMessage = () => {
  const [messageApi, context] = message.useMessage()
  return { message: messageApi, context }
}

export default useMessage
