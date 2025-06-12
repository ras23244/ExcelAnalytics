import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/userContext'
import { useDataContext } from '../context/DataContext';

const Signout = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext);
    const { clearUploads, clearCharts } = useDataContext();
    const token= localStorage.getItem('token');
     const url = `https://excelanalytics-backend.onrender.com`;

    useEffect(() => {
        axios.post(`${url}/user/logout`, {}, {
            headers:{
                Authorization:`Bearer ${token}`
            },
            withCredentials: true
        }).then(response=>{
            if(response.status===200){
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                setUser({ email: '', name: '', role: '' });
                clearUploads();
                clearCharts();
                navigate('/login')
            }
        }).catch(err=>{
            localStorage.removeItem('token');
            setUser({ email: '', name: '', role: '' });
            clearUploads();
            clearCharts();
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
