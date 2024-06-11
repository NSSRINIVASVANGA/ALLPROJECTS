import './index.css'

const ProjectItem = props => {
  const {details} = props
  const {name, imageUrl} = details

  return (
    <li className="card">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name"> {name} </p>
    </li>
  )
}

export default ProjectItem
