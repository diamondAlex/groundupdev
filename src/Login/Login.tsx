//TODO
//set up the textareas to ignore 'enter'
//make event to submit on enter click
//change the password for *
import { useState } from 'react'

let submit = async (api:string, username: string,password: string,next : (status: boolean) => void) => {
    fetch(`http://localhost:5173/api/${api}`,{
        method:"POST",
        body:JSON.stringify({
            username:username,
            password:password
        })
    })
    .then(async (res)=>{
        let text = await res.text()
        if(text === "true"){
            next(true)
        }else{
            alert("SOMETHING WENT WRONG (lol)")
            next(false)
        }
    })
}

function Signup({ link } : {link: (status:boolean) => void}){
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    return (
        <>
            <div style={{flex:1, border:"solid",borderColor:"white"}}>
                Sign up<br/>
                Username:<textarea value={username} onChange={(e)=> setUsername(e.target.value)} /><br/>
                Password<textarea value={password} onChange={(e)=> setPassword(e.target.value)} /><br/>
                <button onClick={() => submit("signup",username,password,link)}> submit </button>
            </div>
        </>
    )
}

function Log({ link } : {link: (status: boolean) => void}){
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    return (
        <>
            <div style={{flex:1, border:"solid",borderColor:"white",padding:"5%"}}>
                Log in<br/>
                Username:<textarea value={username} onChange={(e)=> setUsername(e.target.value)} /><br/>
                Password<textarea value={password} onChange={(e)=> setPassword(e.target.value)} /><br/>
                <button onClick={() => submit("login",username, password, link)}> submit </button>
            </div>
        </>
    )
}

function Login({ link } : {link : (status:boolean) => void} ) {
    const [ display, setDisplay ] = useState(0)

    let swaplog = () =>{
        if(display == 0){
            setDisplay(1)
        }else{
            setDisplay(0)
        }
    }

    return (
        <>
            <div style={{display:"flex",flex:1, padding:"15%"}}>
                {display? <Signup link={ link } />: <Log link={ link } />}
                <div>
                    <button onClick={swaplog} > {display? "log in":"sign up"} </button>
                </div>
            </div>
        </>
    )
}

export default Login
