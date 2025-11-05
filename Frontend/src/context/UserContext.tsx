import axios from 'axios'
import  { createContext, useEffect, useState, type ReactNode } from 'react'

export const userDataContext = createContext<any>(null)

function UserContext({ children }: { children: ReactNode }) {
  const serverUrl = import.meta.env.VITE_BACKEND_URL 
  const [userData, setUserData] = useState<any>(null)
  const [frontendImage, setFrontendImage] = useState<string | null>(null)
  const [backendImage, setBackendImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data.user)
      console.log(result.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  const getGeminiResponse = async (command: string) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true })
      return result.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
