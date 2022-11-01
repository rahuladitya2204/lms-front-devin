import Header from '../../Common/Dashboard/Header/Header'

function Home () {
  return (
    <div className="App">
      <Header />
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
