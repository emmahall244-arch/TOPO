import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { id } = useParams()

  return (
    <div className="container p-2">
      <h1>Project Detail</h1>
      <p>Project ID: {id}</p>
      <p>Project detail page coming soon...</p>
    </div>
  )
}
