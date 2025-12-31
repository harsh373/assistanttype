import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bg from "../assets/j1.jpg";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext<any>(userDataContext);

  const [assistantName, setAssistantName] = useState<string>(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);

    try {
     
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication failed. Please sign in again.");
        navigate("/signin");
        return;
      }

    
      const fullUrl =
        selectedImage && selectedImage.startsWith("/assets/")
          ? `${window.location.origin}${selectedImage}`
          : selectedImage || "";

      
      const formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage instanceof File) {
        
        formData.append("assistantImage", backendImage);
      } else {
       
        formData.append("imageUrl", fullUrl);
      }

      

      
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );



      
      if (result.data.user) {
        setUserData(result.data.user);
      }

      toast.success("Assistant updated successfully!");

      setTimeout(() => navigate("/"), 400);
    } catch (error: any) {
      console.error(" Update Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Error updating assistant. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center flex-col p-5 relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]"
        onClick={() => navigate("/customize")}
      />

      <h1 className="text-white mb-10 font-bold text-center text-6xl">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. Jarvis"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px]"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? "Loading..." : "Finally Create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
