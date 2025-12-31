import { useContext, useState } from "react";
import bg from "../assets/authbg.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";


axios.defaults.withCredentials = true;

const Signin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );


     
      if (result.data.token) {
        localStorage.setItem("token", result.data.token);
       
      } else {
        console.warn("No token returned from backend");
      }

     
      if (result.data.user) {
        setUserData(result.data.user);
      }

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 300);
    } catch (error: any) {
      console.error(" Signin error:", error.response?.data || error.message);
      const errMsg =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errMsg);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[99vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[35vw] min-w-[320px] h-[70vh] bg-white/90 backdrop-blur shadow-lg rounded-xl flex flex-col items-center justify-center gap-5 px-5"
        onSubmit={handleSignIn}
      >
        <h1 className="text-black text-5xl font-semibold mb-[30px] text-center">
          Login to <span className="text-blue-500">Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-[150px] h-12 text-white font-bold rounded-md transition-all duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p
          className="text-black text-md cursor-pointer mt-3"
          onClick={() => navigate("/signup")}
        >
          Don't have an account?{" "}
          <span className="text-blue-500 hover:underline">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
