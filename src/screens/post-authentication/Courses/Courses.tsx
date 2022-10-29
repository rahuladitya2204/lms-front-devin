import { Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { getItemFromStorage } from '../../../utils/storage'
import { useEffect } from 'react'

console.log('toi')
function CoursesScreen() {
  return (
    <div className="App">
      <div className="row">
        <div className="col-md-12">
          <h3>This is CoursesScreen component</h3>
          <a href="http://www.pdf995.com/samples/pdf.pdf">Hello</a>
          {/* <NavLink>
            <Button type="primary">Submit</Button>
          </NavLink> */}
        </div>
      </div>
    </div>
  )
}

export default CoursesScreen
