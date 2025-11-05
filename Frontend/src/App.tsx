import  { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/Signup'
import SignIn from './pages/Signin'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { userData, setUserData } = useContext<any>(userDataContext)

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            userData?.assistantImage && userData?.assistantName ? (
              <Home />
            ) : (
              <Navigate to="/customize" />
            )
          }
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signup" />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signup" />}
        />
      </Routes>
    </div>
  )
}

export default App
