import React, { useContext,useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/userContext';


const AdminProtectWrapper = ({ children }) => {
    const url = `https://excelanalytics-backend.onrender.com`;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {user,setUser}= useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        axios.get(`${url}/user/admin-profile`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(response=>{
            if(response.status===200){
                setUser(response.data);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err)
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [token])

    

    if(isLoading){
        return <div>Loading...</div>
    }
    

    return <>{children}</>; 
};
 

export default AdminProtectWrapper
