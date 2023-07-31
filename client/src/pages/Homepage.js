import { Link } from "react-router-dom"

function Homepage() {

  return <div>
    <h1>This is the homepage</h1>
    <Link to='posts?limit=5&page=1&sortBy=created_at&sortDesc=true'>Go to posts</Link>
  </div>
}

export default Homepage
