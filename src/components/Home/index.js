import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Navbar from '../Navbar'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  progress: 'PROGRESS',
}

class Home extends Component {
  state = {
    activeValue: categoriesList[0].id,
    projectList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getList()
  }

  getData = data => ({
    id: data.id,
    name: data.name,
    imageUrl: data.image_url,
  })

  onSuccess = data => {
    const updatedList = data.projects.map(eachItem => this.getData(eachItem))

    this.setState({
      projectList: updatedList,
      apiStatus: apiStatusConstants.success,
    })
  }

  onFail = () => {
    this.setState({apiStatus: apiStatusConstants.fail})
  }

  getList = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {activeValue} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeValue}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data)
    } else {
      this.onFail()
    }
  }

  changeOption = event => {
    console.log(event.target.value)
    this.setState({activeValue: event.target.value}, this.getList)
  }

  renderSuccess = () => {
    const {activeValue, projectList} = this.state
    return (
      <div className="home-con">
        <Navbar />
        <div className="con">
          <select
            value={activeValue}
            onChange={this.changeOption}
            className="select-el"
          >
            {categoriesList.map(eachItem => (
              <option value={eachItem.id} key={eachItem.id}>
                {' '}
                {eachItem.displayText}{' '}
              </option>
            ))}
          </select>
          <ul className="list-con">
            {projectList.map(eachItem => (
              <ProjectItem details={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onRetry = () => this.getList()

  renderFail = () => (
    <div className="con">
      <Navbar />
      <div className="fail-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="fail-img"
        />
        <h1> Oops! something Went Wrong </h1>
        <p> We cannot seem to find the page you are looking for. </p>
        <button type="button" className="button" onClick={this.onRetry}>
          {' '}
          Retry{' '}
        </button>
      </div>
    </div>
  )

  renderProgress = () => (
    <div className="con">
      <Navbar />
      <div className="fail-con" data-testid="loader">
        <Loader type="ThreeDots" color="#328af2" width={60} height={60} />
      </div>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.fail:
        return this.renderFail()
      case apiStatusConstants.progress:
        return this.renderProgress()
      default:
        return null
    }
  }
}

export default Home
