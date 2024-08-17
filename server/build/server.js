//TODO
//check for existing username
//make the error messages more explicit
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { setPfpUrl, getProfile, register, login, setProfile } from './user.js';
import { removeSession, setSession, getSession } from './auth.js';
// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
//is this fucking express garbage useless?
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function clearCookie(res) {
    res.setHeader('set-cookie', "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
}
app.post('/api/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cookie_header = req.headers['cookie'];
    if (cookie_header) {
        let cookie = cookie_header.split("=")[1];
        let result = yield removeSession(cookie);
        if (result == false) {
            res.end();
        }
        //check if worked
        clearCookie(res);
    }
    res.end();
}));
//get sessions
app.get('/api/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cookie_header = req.headers['cookie'];
    if (cookie_header) {
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1];
        let logged = yield getSession(cookie);
        if (logged) {
            res.write("logged");
        }
        else {
            clearCookie(res);
            res.write("not");
        }
    }
    else {
        res.write("not");
    }
    res.end();
}));
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password } = JSON.parse(chunk.toString());
        let status = yield register(username, password);
        if (status != null) {
            let cookie = crypto.randomUUID();
            let result = yield setSession({ username, cookie });
            if (result) {
                res.cookie('token', cookie, { maxAge: 900000, httpOnly: true });
                res.write("true");
                res.end();
            }
            else {
                res.write("false");
                res.end();
            }
        }
        else {
            res.write("false");
            res.end();
        }
    }));
}));
//set it up to create or update
app.post("/api/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //can't be checking session manually like that every time (dumbass)
    let cookie_header = req.headers["cookie"];
    if (cookie_header) {
        let cookie = cookie_header.split("=")[1];
        let session = yield getSession(cookie);
        if (session != undefined) {
            let profile = yield setProfile(req.body);
            res.write(JSON.stringify(profile));
        }
    }
    res.end();
}));
app.get("/api/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cookie_header = req.headers["cookie"];
    if (cookie_header) {
        let cookie = cookie_header.split("=")[1];
        let session = yield getSession(cookie);
        if (session != undefined) {
            let profile = yield getProfile(session.username);
            if (profile) {
                res.write(JSON.stringify(profile));
            }
        }
    }
    res.end();
}));
app.post('/api/uploadpfp', (req, res) => {
    let fileData = '';
    //do I need this????
    req.setEncoding('binary');
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        fileData += chunk;
    }));
    req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        //get this out!!!
        let cookie_header = req.headers["cookie"];
        let profile = null;
        if (cookie_header) {
            let cookie = cookie_header.split("=")[1];
            profile = (yield getSession(cookie));
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
        if (!profile) {
            //better rets
            return res.status(500).send('Error saving file.');
        }
        const filePath = path.join('pfps', profile.username + ".jpeg");
        yield setPfpUrl('pfps/' + profile.username + ".jpeg", profile.username);
        console.log("sup");
        // Save the file to the uploads directory
        fs.writeFile(filePath, fileData, 'binary', (err) => {
            if (err) {
                return res.status(500).send('Error saving file.');
            }
            return res.send('File uploaded successfully.');
        });
    }));
});
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //this is apparently wrong, just use express middleware
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password } = JSON.parse(chunk.toString());
        let status = yield login(username, password);
        if (status != null) {
            //this could be its own function
            let cookie = crypto.randomUUID();
            let result = yield setSession({ username, cookie });
            if (result) {
                res.cookie('token', cookie, { maxAge: 900000, httpOnly: true });
                res.write("true");
                res.end();
            }
            else {
                res.write("false");
                res.end();
            }
        }
        else {
            //this blows
            res.write("false");
            res.end();
        }
    }));
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
