

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
    // 🧠 Convert /assets/... into full public URLs (e.g. https://assistant-neon.vercel.app/assets/image2.jpg)
    const fullUrl =
      selectedImage?.startsWith("/assets/")
        ? `${window.location.origin}${selectedImage}`
        : selectedImage;

    const formData = new FormData();
    formData.append("assistantName", assistantName);

    // 🧩 If user uploaded a real file, attach it
    if (backendImage instanceof File) {
      formData.append("assistantImage", backendImage);
    } else {
      // Otherwise send the resolved image URL (full)
      formData.append("imageUrl", fullUrl || "");
    }

    const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUserData(result.data.user);
    toast.success("Assistant changed successfully");

    // Navigate after slight delay to allow context update
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
