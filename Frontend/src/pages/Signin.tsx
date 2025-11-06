import { useContext, useState } from 'react';
import bg from '../assets/authbg.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';

// Always send cookies with every request
axios.defaults.withCredentials = true;

const Signin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Hit your backend’s signin route
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      // ✅ Store only the user object
      setUserData(result.data.user);
       localStorage.setItem("token", result.data.token);

      console.log('Signin successful:', result.data.user);

      // ✅ Redirect on success
      navigate('/');
    } catch (error: any) {
      console.error('Signin error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Invalid email or password');
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
        className="w-[35vw] h-[70vh] bg-white backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5"
        onSubmit={handleSignIn}
      >
        <h1 className="text-black text-5xl font-semibold mb-[30px]">
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
          placeholder="Enter your Password"
          className="w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-30 h-10 text-white font-bold bg-blue-500 hover:bg-blue-600 transition-all duration-200 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Submit'}
        </button>

        <p
          className="text-black text-1xl cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Don't have an account?{' '}
          <span className="text-blue-500">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
