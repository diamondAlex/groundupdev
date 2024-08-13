//import { useState } from 'react'
import Login from './Login/Login'
import Profile from './Profile/Profile'
import { useState, useEffect } from 'react'

function App() {
    const [ logged, setLogged ] = useState(false)
    
    useEffect(() =>{
        fetch("http://localhost:5173/api/session",{
            method:"GET"
        }) 
        .then((res) => {
            res.text().then((text) =>{
                if(text == "logged"){
                    setLogged(true)
                }else{
                    setLogged(false)
                }
            })
        })
    },[])

    let handleClick = (status: boolean) =>{
        setLogged(status) 
    }    

    console.log(logged)

    return (
        <>
            <div style={{display:'flex',flex:1,color:"white"}}>
                {
                    logged?
                        <Profile />:
                        logged?
                            <div>hi</div>:
                            <Login link={(status: boolean) => handleClick(status)} />
                }
            </div>
        </>
    )
}

export default App
