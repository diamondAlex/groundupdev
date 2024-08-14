//TODO
//check for existing username
//make the error messages more explicit

import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { getProfile, getSession, getPassword, register, login, setProfile } from './user.js'

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;


let sessions : {username:string, cookie:string}[] = []

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


function clearCookie(res: Response){
    res.setHeader('set-cookie', 
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")
}

app.post('/api/logout', (req: Request, res: Response) => {
    clearCookie(res)
    res.end()
});

//add sessions
app.get('/api/session', (req: Request, res: Response) => {
    let cookie_header = req.headers['cookie']
    if(cookie_header){
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1]
        let logged = sessions.find((e) => {
            return e.cookie == cookie
        })

        if(logged){
            res.write("logged")
        }
        else{
            clearCookie(res)
            res.write("not")
        }
    }else{
        res.write("not")
    }
    res.end()
});

app.post('/api/signup', (req : Request, res: Response) => {
    req.on('data', async (chunk) =>{
        let {username, password} : {username: string, password:string } = JSON.parse(chunk.toString())
        let status = await register(username, password)
        if(status != null){
            let cookie = crypto.randomUUID()
            sessions.push({username:username, cookie:cookie})
            res.cookie('token',cookie, { maxAge: 900000, httpOnly: true });
            res.write("true")
            res.end()
        }else{
            res.write("false") 
            res.end()
        }
    })
})

app.post("/api/profile", async (req: Request, res : Response) => {
    //can't be checking session manually like that every time (dumbass)
    let cookie_header: string | undefined = req.headers["cookie"]
    if(cookie_header){
        let cookie = cookie_header.split("=")[1]
        let session = sessions.find((e) => e.cookie == cookie)
        if(session != undefined){
            let profile = await setProfile(req.body)
            res.write(JSON.stringify(profile))
        }
    }
    res.end()
})

app.get("/api/profile", async (req: Request, res : Response) => {
    let cookie_header: string | undefined = req.headers["cookie"]
    if(cookie_header){
        let cookie = cookie_header.split("=")[1]
        let session = sessions.find((e) => e.cookie == cookie)
        if(session != undefined){
            let profile = await getProfile(session.username)
            res.write(JSON.stringify(profile))
        }
    }
    res.end()
})

app.post('/api/login', (req: Request, res: Response) => {
    //this is apparently wrong, just use express middleware
    req.on('data', async (chunk) =>{
        let {username, password} : {username: string, password:string } = JSON.parse(chunk.toString())
        let status = await login(username, password)
        if(status != null){
            let cookie = crypto.randomUUID()
            sessions.push({username:username, cookie:cookie})
            res.cookie('token',cookie, { maxAge: 900000, httpOnly: true });
            res.write("true") 
            res.end()
        }else{
            //this blows
            res.write("false") 
            res.end()
        }
    })

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

