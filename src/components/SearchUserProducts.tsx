import { Enum, User } from '@adewaskar/lms-common'

import { Select } from 'antd'
import { useState } from 'react'

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
      style={{ width: 200, marginBottom: 20 }}
      onSelect={props.onSelect}
      options={products.map(e => {
        return {
          label: e.title,
          value: e._id
        }
      })}
    />
  )
}
