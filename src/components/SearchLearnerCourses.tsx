import { AutoComplete, Avatar, Space, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import Image from './Image'
import Search from 'antd/es/input/Search'
import { useNavigate } from 'react-router'
import { useState } from 'react'

const { Title, Text } = Typography

export default function SearchLearnerCourses() {
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const {
    data: seachedProducts,
    isFetching: loading
  } = Learner.Queries.useSearchProducts(
    {
      searchValue: text
    },
    {
      enabled: !!text
    }
  )
  const allProducts = Object.keys(seachedProducts)
    // @ts-ignore
    .map(k => seachedProducts[k])
    .flat()
  const listItems = Object.keys(seachedProducts)
    .map((productType: string) => {
      // @ts-ignore
      const items = seachedProducts[productType]
      // @ts-ignore
      return items.map(c => {
        return {
          label: (
            <Space
              onClick={e => {
                navigate(`${productType}/${c._id}`)
              }}
              align="center"
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Avatar
                shape="square"
                style={{ background: 'transparent' }}
                size={45}
                icon={<Image src={c.thumbnailImage} />}
              />{' '}
              <Space direction="vertical" align="baseline">
                <Title style={{ margin: 0 }} level={5}>
                  {c.title}
                </Title>
                {/* <Text style={{ margin: 0 }}>
                    Taught By: {instructor.name}
                  </Text> */}
              </Space>
            </Space>
          ),
          value: c.title
        }
      })
    })
    .flat()
  return (
    <AutoComplete
      onChange={(e, a) => {
        const item = allProducts.find(o => o.title === e)
        console.log(item, 'item')
      }}
      popupClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      style={{ width: 250 }}
      options={listItems}
    >
      <Search
        placeholder="Search for courses.."
        allowClear
        value={text}
        loading={loading}
        onChange={(e: any) => setText(e.target.value)}
        onSearch={e => console.log(e, 'eee')}
        style={{ width: 500 }}
      />
    </AutoComplete>
  )
}
