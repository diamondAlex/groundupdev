//TODO
//check for existing username
//make the error messages more explicit

import * as fs from 'fs'
import express, { Request, Response } from 'express';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { 
    setPfpUrl,
    getProfile, 
    register, 
    login, 
    setProfile 
} from './user.js'
import { removeSession, setSession, getSession, Session} from './auth.js'

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

//is this fucking express garbage useless?
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function clearCookie(res: Response){
    res.setHeader('set-cookie', 
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")
}

app.post('/api/logout', async (req: Request, res: Response) => {
    let cookie_header = req.headers['cookie']
    if(cookie_header){
        let cookie = cookie_header.split("=")[1]
        let result = await removeSession(cookie)
        if(result == false){
            res.end()
        }
        //check if worked
        clearCookie(res)
    }
    res.end()
});

//get sessions
app.get('/api/session', async (req: Request, res: Response) => {
    let cookie_header = req.headers['cookie']
    if(cookie_header){
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1]
        let logged = await getSession(cookie)

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

app.post('/api/signup', async (req : Request, res: Response) => {
    req.on('data', async (chunk) =>{
        let {username, password} : {username: string, password:string } = JSON.parse(chunk.toString())
        let status = await register(username, password)
        if(status != null){
            let cookie = crypto.randomUUID()
            let result = await setSession({username, cookie})
            if(result){
                res.cookie('token',cookie, { maxAge: 900000, httpOnly: true });
                res.write("true")
                res.end()
            }else{
                res.write("false") 
                res.end()
            }
        }else{
            res.write("false") 
            res.end()
        }
    })
})

//set it up to create or update
app.post("/api/profile", async (req: Request, res : Response) => {
    //can't be checking session manually like that every time (dumbass)
    let cookie_header: string | undefined = req.headers["cookie"]
    if(cookie_header){
        let cookie = cookie_header.split("=")[1]
        let session = await getSession(cookie) as Session;
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
        let session = await getSession(cookie) as Session;
        if(session != undefined){
            let profile = await getProfile(session.username)
            if(profile){
                res.write(JSON.stringify(profile))
            }

        }
    }
    res.end()
})


app.post('/api/uploadpfp', (req, res) => {
    let fileData = '';
    //do I need this????
    req.setEncoding('binary');

    req.on('data', async (chunk) => {
        fileData += chunk;
    });

    req.on('end', async () => {
        //get this out!!!
        let cookie_header: string | undefined = req.headers["cookie"]
        let profile: Session | null= null;
        if(cookie_header){
            let cookie = cookie_header.split("=")[1]
            profile = await getSession(cookie) as Session;
        }

        //let fileData_s : string[] = fileData.split("\n")
        //fileData = ""
        //fileData_s.forEach((e,i) => {
            //if(i <4 || i == fileData_s.length-2){
                //console.log(e)
                //return
            //}else{
                //fileData += e + "\n"
            //}
        //})
        
        if(!profile){
            //better rets
            return res.status(500).send('Error saving file.');
        }

        const filePath = path.join('pfps', profile.username+".jpeg");

        await setPfpUrl('pfps/'+profile.username+ ".jpeg", profile.username );
        console.log("sup")

        // Save the file to the uploads directory
        fs.writeFile(filePath, fileData, 'binary', (err) => {
            if (err) {
                return res.status(500).send('Error saving file.');
            }
            return res.send('File uploaded successfully.');
        });
    })

});

app.post('/api/login', async (req: Request, res: Response) => {
    //this is apparently wrong, just use express middleware
    req.on('data', async (chunk) =>{
        let {username, password} : {username: string, password:string } = JSON.parse(chunk.toString())
        let status = await login(username, password)
        if(status != null){
            //this could be its own function
            let cookie = crypto.randomUUID()
            let result = await setSession({username, cookie})
            if(result){
                res.cookie('token',cookie, { maxAge: 900000, httpOnly: true });
                res.write("true") 
                res.end()
            }else{
                res.write("false") 
                res.end()
            }
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

