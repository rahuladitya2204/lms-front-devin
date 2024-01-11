import { Button, Select, Spin } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreateTest from './CreateTest'
import Header from '@User/Screens/UserRoot/UserHeader'
// import PastTest from './PastTest'
import Tabs from '@Components/Tabs'
import TestsList from './TestsList'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useSearchParams } from 'react-router-dom'

const TestsScreen = () => {
  const [status, setStatus] = useState('upcoming')
  // const category = params.get('category')
  const {
    data: categories,
    isLoading: loadingCategories
  } = User.Queries.useGetProductCategories('all')
  const CategoriesSelect = (
    <Select onChange={e => setStatus(e)} value={status} style={{ width: 150 }}>
      <Select.Option value={`upcoming`} key={`upcoming`}>
        Upcoming Tests
      </Select.Option>
      <Select.Option value={`past`} key={`past`}>
        Past Tests
      </Select.Option>
    </Select>
  )
  // const navigate = useNavigate()
  const CreateCourseCta = (
    <Button onClick={() => openModal(<CreateTest />)} type="primary">
      Create Test
    </Button>
    // <ActionModal cta={<Button type="primary">Create Test</Button>}>
    //   <CreateTest />
    // </ActionModal>
  )

  // useEffect(
  //   () => {
  //     setParams({ category: categories[0]?._id })
  //   },
  //   [categories]
  // )
  const { openModal } = useModal()
  return (
    <Header title="Tests" extra={[CreateCourseCta]}>
      {/* <Card> */}
      <Spin spinning={loadingCategories}>
        <Tabs
          navigateWithHash
          tabBarExtraContent={{ right: CategoriesSelect }}
          // defaultActiveKey="1"
          items={[
            ...categories.map(c => {
              return {
                key: c._id,
                label: c.title,
                children: (
                  <TestsList
                    filter={{
                      // @ts-ignore
                      category: c._id,
                      status:
                        status === 'upcoming'
                          ? [
                            Enum.TestStatus.DRAFT,
                            Enum.TestStatus.PUBLISHED,
                            Enum.TestStatus.IN_PROGRESS
                          ]
                          : [Enum.TestStatus.ENDED]
                    }}
                  />
                )
              }
            }),
            {
              label: 'All',
              key: 'non-category',
              children: (
                <TestsList
                  filter={{
                    // @ts-ignore
                    status: [
                      Enum.TestStatus.DRAFT,
                      Enum.TestStatus.PUBLISHED,
                      Enum.TestStatus.IN_PROGRESS
                    ]
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
