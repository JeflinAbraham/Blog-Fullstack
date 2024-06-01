import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />

        {/* the PrivateRoute component, using Outlet allows you to conditionally render the protected routes based on the authentication state. */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path='create-post' element={<CreatePost/>} />
          <Route path='update-post/:postId' element={<UpdatePost/>} />
        </Route>
        <Route path='/Projects' element={<Projects />} />
        <Route path='/post/:postslug' element={<PostPage/>} />

      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  )
}

export default App