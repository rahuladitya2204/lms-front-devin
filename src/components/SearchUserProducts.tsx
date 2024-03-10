import { Enum, User } from '@adewaskar/lms-common'
import { Image, Select } from 'antd'

import { Typography } from './Typography';
import { useState } from 'react'

const { Text } = Typography
interface SearchUserProductsPropsI {
  onSelect: any;
  type: Enum.ProductType;
  label?: React.ReactNode | string;
}

export default function SearchUserProducts(props: SearchUserProductsPropsI) {
  const [searchValue, setSearchValue] = useState('')
  console.log(searchValue, 'valk')
  const { data: products } = User.Queries.useGetProductList(props.type, {
    searchValue
  })
  return (
    <Select
      showSearch
      onSearch={setSearchValue}
      placeholder={props.label || 'Select to add product'}
      style={{ width: 300, marginBottom: 20 }}
      onSelect={props.onSelect}
      // @ts-ignore
      options={products.filter(p => p.status === 'published').map(e => {
        return {
          label: (
            <Text>
              {' '}
              <Image
                preview={false}
                style={{ width: 50, height: 50 }}
                src={e.thumbnailImage}
              />{' '}
              {e.title}
            </Text>
          ),
          value: e._id
        }
      })}
    />
  )
}
