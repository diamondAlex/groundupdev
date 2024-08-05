//import { useState } from 'react'
import Login from './Login/Login'
import Profile from './Profile/Profile'
import { useState, useEffect } from 'react'

function App() {
    const [ logged, setLogged ] = useState(0)
    
    useEffect(() =>{
        fetch("http://localhost:5173/api/session",{
            method:"GET"
        }) 
        .then((res) => {
            res.text().then((text) =>{
                console.log("RES")
                if(text == "logged"){
                    setLogged(1)
                }
            })
        })
    },[])

    let handleClick = () =>{
        setLogged(1) 
    }    

    return (
        <>
            {
                logged?<Profile />:<Login link={handleClick} />
            }
        </>
    )
}

export default App
