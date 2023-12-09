import { Button, Select, Spin, Typography } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreateTest from './CreateTest'
import Header from '@User/Screens/UserRoot/UserHeader'
// import PastTest from './PastTest'
import Tabs from '@Components/Tabs'
import TestsList from './TestsList'
import { useSearchParams } from 'react-router-dom'

const TestsScreen = () => {
  // const [category, setCategory] = useState('')
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const {
    data: categories,
    isLoading: loadingCategories
  } = User.Queries.useGetProductCategories('all')
  const CategoriesSelect = (
    <Select
      onChange={e => setParams({ category: e })}
      value={category}
      style={{ width: 150 }}
    >
      {categories.map(category => (
        <Select.Option value={category._id} key={category._id}>
          {category.title}
        </Select.Option>
      ))}
    </Select>
  )
  // const navigate = useNavigate()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Test</Button>}>
      <CreateTest />
    </ActionModal>
  )

  useEffect(
    () => {
      setParams({ category: categories[0]?._id })
    },
    [categories]
  )

  return (
    <Header title="Tests" extra={[CreateCourseCta]}>
      {/* <Card> */}
      <Spin spinning={loadingCategories}>
        <Tabs
          navigateWithHash
          tabBarExtraContent={{ right: CategoriesSelect }}
          // defaultActiveKey="1"
          items={[
            {
              key: 'upcoming',
              label: `Upcoming`,
              children: (
                <TestsList
                  filter={{
                    // @ts-ignore
                    category: category,
                    status: [
                      Enum.TestStatus.DRAFT,
                      Enum.TestStatus.PUBLISHED,
                      Enum.TestStatus.IN_PROGRESS
                    ]
                  }}
                />
              )
            },
            {
              key: 'past',
              label: `Past`,
              children: (
                <TestsList
                  filter={{
                    // @ts-ignore
                    category: category,
                    status: [Enum.TestStatus.ENDED]
                  }}
                />
              )
            }
          ]}
        />
      </Spin>
    </Header>
  )
}

export default TestsScreen
