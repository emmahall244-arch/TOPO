import { useParams } from 'react-router-dom'

export default function Scheduling() {
  const { id } = useParams()

  return (
    <div className="container p-2">
      <h1>Scheduling</h1>
      <p>Project ID: {id}</p>
      <p>Scheduling page coming soon...</p>
    </div>
  )
}
