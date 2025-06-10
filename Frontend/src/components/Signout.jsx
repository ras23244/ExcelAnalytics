import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/userContext'

const Signout = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext);
    const token= localStorage.getItem('token');

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_BASE_URL}/user/logout`, {}, {
            headers:{
                Authorization:`Bearer ${token}`
            },
            withCredentials: true
        }).then(response=>{
            if(response.status===200){
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                setUser({ email: '', name: '', role: '' });
                navigate('/login')
            }
        }).catch(err=>{
            localStorage.removeItem('token');
            setUser({ email: '', name: '', role: '' });
            navigate('/login');
        });
    }, []);

  return (
    <div>
      Signing you out...
    </div>
  )
}

export default Signout