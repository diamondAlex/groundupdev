//todo: 
//fix image sizing
//style textarea
//change urls for .env dev/prod strings

import { useState } from 'react'

function test(){
    console.log("test") 
}

test()

function Profile() {
    const [ username, setUsername ] = useState("")
    const [ name, setName ] = useState("")
    const [ lastname, setLastname ] = useState("")
    const [ desc, setDesc ] = useState("")
    const [ edu, setEdu ] = useState("")

    function disconnect(){
        fetch("http://localhost:5173/api/logout", {
            method:"POST"
        })

        window.location.replace('/') 
    }

    return (
        <>
            <div style={{width:"100%",height:"100%",border:"solid"}}>
                <div style={{width:"100%",height:"5%",border:"solid"}}>
                    <button onClick={disconnect}> logout </button>
                </div>
                <div style={{flex:1,display:"flex",paddingLeft:"15%",paddingRight:"15%",padding:"9%"}}>
                    <div style={{color:"white",flex:1,border:"solid"}}>
                        
                        <img style={{width:"100%",height:"100%",overflow:"hidden"}} src='test.jpg'/>
                        
                    </div>
                    <div style={{color:"white",flex:2,border:"solid",height:""}}>
                        
                        Username:<textarea value={username} onChange={(e)=> setUsername(e.target.value)}/><br/>
                        Name:<textarea value={name} onChange={(e)=> setName(e.target.value)}/><br/>
                        Last Name:<textarea value={lastname} onChange={(e)=> setLastname(e.target.value)}/><br/>
                        Description:<textarea value={desc} onChange={(e)=> setDesc(e.target.value)}/><br/>
                        Education:<textarea value={edu} onChange={(e)=> setEdu(e.target.value)}/><br/>
                        
                        {username}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
