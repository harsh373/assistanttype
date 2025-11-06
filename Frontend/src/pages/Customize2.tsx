

import  { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bg from '../assets/j1.jpg'


function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext<any>(userDataContext)
  const [assistantName, setAssistantName] = useState<string>(userData?.assistantName || "")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

const handleUpdateAssistant = async () => {
  setLoading(true);
  try {
    let result;
    const hasFile = backendImage instanceof File; // ✅ real file check
    const hasImageUrl = !!(selectedImage || backendImage);
    const hasName = assistantName.trim().length > 0;

    if (!hasName && !hasFile && !hasImageUrl) {
      toast.error("Please provide at least a name or image");
      setLoading(false);
      return;
    }

    if (hasFile) {
      // ✅ Case 1: real file
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      formData.append("assistantImage", backendImage);
      result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // ✅ Case 2: JSON payload
      result = await axios.post(
        `${serverUrl}/api/user/update`,
        {
          assistantName,
          imageUrl: selectedImage || backendImage || "",
        },
        { withCredentials: true }
      );
    }

    setUserData(result.data.user);
    toast.success("Assistant changed successfully");
    setTimeout(() => navigate("/"), 300);
  } catch (error) {
    console.error("Update Error:", error);
    toast.error("Error updating assistant. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className='w-full h-screen bg-cover   flex justify-center items-center flex-col p-5 relative  ' style={{ backgroundImage: `url(${bg})` }}>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate("/customize")} />
      
      <h1 className='text-white mb-10 text-bold text-center text-6xl '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
      
      <input
        type="text"
        placeholder='eg. jarvis'
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px]'
          disabled={loading}
          onClick={() => handleUpdateAssistant()}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  )
}

export default Customize2
