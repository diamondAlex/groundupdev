//todo: 
//fix image sizing
//style textarea
//change urls for .env dev/prod strings

import { useState, useEffect } from 'react'

interface Profile{
    username:string,
    name:string,
    lastname:string,
    description:string,
    education:string
}

function Profile() {
    const [ username, setUsername ] = useState("")
    const [ name, setName ] = useState("")
    const [ lastname, setLastname ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ education, setEducation ] = useState("")

    useEffect(() => {
        fetch("http://localhost:5173/api/profile",{
            method:"GET"
        })
        .then(async (res) =>{
            //this is yuck?
            let ret_arr : Profile[] = await res.json()
            if(ret_arr.length != 0){
                let ret = ret_arr[0]
                setUsername(ret.username)
                setName(ret.name)
                setLastname(ret.lastname)
                setDescription(ret.description)
                setEducation(ret.education)
            }
        })
    },[])

    function disconnect(){
        fetch("http://localhost:5173/api/logout", {
            method:"POST"
        })

        window.location.replace('/') 
    }

    function submit(){
        let body: Profile = {
            username:username,
            name:name,
            lastname:lastname,
            description:description,
            education:education,
        }
        console.log(body)
        fetch("http://localhost:5173/api/profile", {
            method:"POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        })
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
                        Description:<textarea value={description} onChange={(e)=> setDescription(e.target.value)}/><br/>
                        Education:<textarea value={education} onChange={(e)=> setEducation(e.target.value)}/><br/>
                        
                        <button onClick={submit}>submit</button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
