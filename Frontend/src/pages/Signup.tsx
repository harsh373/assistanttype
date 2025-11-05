import { useContext, useState } from 'react'
import bg from '../assets/authbg.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'


const Signup = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigate = useNavigate()
   
    const { serverUrl, setUserData } = useContext(userDataContext);
    console.log(serverUrl);

    
    const handleSignUp = async (e: any) => {
        e.preventDefault() // Add your signup logic here
    

        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name, email, password
            }, { withCredentials: true });
        
            setUserData(result.data);
          //  console.log(result.data);
            navigate('/customize')
        
        } catch (error) {
            console.log(error);
            setUserData(null);
        
        }
    }
    
    return (
       
        <div className="w-full h-[99vh] bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${bg})` }}> 
            
            <form className='w-[35vw] h-[70vh] bg-white backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5' onSubmit={handleSignUp}>
                <h1 className='text-black  text-5xl font-semibold mb-[30px]'>Register to <span className='text-blue-500'>Assistant
                </span></h1>

                <input type='text' placeholder='Enter your name' className='w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500' required onChange={(e) => setName(e.target.value)} value={name} />
                
                <input type='email' placeholder='Enter your email' className='w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500' required onChange={(e) => setEmail(e.target.value)} value={email} />
                
                <input type="password" placeholder='Enter your Password' className=' w-full h-12 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 '
                    required onChange={(e) => setPassword(e.target.value)} value={password} />
                
                <button className='w-30 h-10 text-white font-bold  bg-blue-500 '>Submit</button>

                <p className='text-black  text-1xl cursor-pointer' onClick={() => navigate("/signin")}>
                    Already have an account? <span className='text-blue-500'>Sign In</span>
                </p>
            </form>
            
        


          

      </div>
     
  )
}

export default Signup
