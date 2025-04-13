import { NavLink , Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Forum from './components/Forum'

function App() {
  return (
    <>
        <nav className='center'>
          <NavLink className='navlink' to='/'>
            Home
          </NavLink>
          <NavLink className='navlink' to='/forum'>
            Forum
          </NavLink>

        </nav>

        <Routes>
        <Route path='/'  element = {<Home />} />
        <Route path='/forum' element = {<Forum />} />
      </Routes>
    </>
  )
}

export default App
