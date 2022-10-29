import { Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { getItemFromStorage } from '../../../utils/storage'
import { useEffect } from 'react'

function Home() {
  useEffect(() => {
    let token
    ;(async () => {
      try {
        token = await getItemFromStorage('token')
      } catch (er) {
        console.log(er, 'er')
      }
    })()
  }, [])

  return (
    <div className="App">
      <div className="row">
        <div className="col-md-12">
          <h3>This is home component</h3>
          <a href="http://www.pdf995.com/samples/pdf.pdf">Hello</a>
          {/* <NavLink>
            <Button type="primary">Submit</Button>
          </NavLink> */}
        </div>
      </div>
    </div>
  )
}

export default Home
