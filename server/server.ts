//TODO
//check for existing username
//make the error messages more explicit

import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { getSession, getPassword, register, login } from './user.js'

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;


let sessions : {username:string, cookie:string}[] = []

//is this still relevant?
app.use((req : Request, res : Response, next: NextFunction) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
})

app.use(express.static(path.join(__dirname, 'public')));

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
    console.log('session')
    let cookie_header = req.headers['cookie']
    if(cookie_header){
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1]
        let logged = sessions.find((e) => {
            return e.cookie == cookie
        })
        console.log(logged)
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
    console.log("signup")
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

app.post('/api/login', (req: Request, res: Response) => {
    req.on('data', async (chunk) =>{
        let {username, password} : {username: string, password:string } = JSON.parse(chunk.toString())
        let status = await login(username, password)
        if(status != null){
            let cookie = crypto.randomUUID()
            sessions.push({username:username, cookie:cookie})
            console.log(sessions)
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

