import { Link } from 'react-router-dom'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h2>Topo Platform</h2>
        </div>
        <div className={styles.links}>
          <Link to="/">Projects</Link>
          <div className={styles.userMenu}>
            <button className="secondary">Profile</button>
            <button className="secondary">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
