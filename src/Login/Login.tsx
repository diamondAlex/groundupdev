import { useState } from 'react'

let submit = async (username: string,password: string,next : () => void) => {
    fetch("http://localhost:5173/api/login",{
        method:"POST",
        body:JSON.stringify({
            username:username,
            password:password
        })
    })
    .then(async (res)=>{
        let j = await res.text()
        console.log(j)
    })
    next()
}

function Signup({ link } : {link: () => void}){
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    return (
        <>
            Sign up page<br/>
            Username:<textarea value={username} onChange={(e)=> setUsername(e.target.value)} />
            Password<textarea value={password} onChange={(e)=> setPassword(e.target.value)} />
            <button onClick={() => submit(username,password,link)}> submit </button>
        </>
    )
}

function Log({ link } : {link: () => void}){
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    return (
        <>
            Log in page<br/>
            Username:<textarea value={username} onChange={(e)=> setUsername(e.target.value)} />
            Password<textarea value={password} onChange={(e)=> setPassword(e.target.value)} />
            <button onClick={() => submit(username, password, link)}> submit </button>
        </>
    )
}

function Login({ link } : {link : () => void} ) {
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
            <div>
                {display? <Signup link={ link } />: <Log link={ link } />}
                <button onClick={swaplog} > {display? "log in":"sign up"} </button>
            </div>
        </>
    )
}

export default Login
