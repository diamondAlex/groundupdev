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
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getProfile, register, login, setProfile } from './user.js';
// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
let sessions = [];
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
function clearCookie(res) {
    res.setHeader('set-cookie', "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
}
app.post('/api/logout', (req, res) => {
    clearCookie(res);
    res.end();
});
//add sessions
app.get('/api/session', (req, res) => {
    let cookie_header = req.headers['cookie'];
    if (cookie_header) {
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1];
        let logged = sessions.find((e) => {
            return e.cookie == cookie;
        });
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
});
app.post('/api/signup', (req, res) => {
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password } = JSON.parse(chunk.toString());
        let status = yield register(username, password);
        if (status != null) {
            let cookie = crypto.randomUUID();
            sessions.push({ username: username, cookie: cookie });
            res.cookie('token', cookie, { maxAge: 900000, httpOnly: true });
            res.write("true");
            res.end();
        }
        else {
            res.write("false");
            res.end();
        }
    }));
});
app.post("/api/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //can't be checking session manually like that every time (dumbass)
    let cookie_header = req.headers["cookie"];
    if (cookie_header) {
        let cookie = cookie_header.split("=")[1];
        let session = sessions.find((e) => e.cookie == cookie);
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
        let session = sessions.find((e) => e.cookie == cookie);
        if (session != undefined) {
            let profile = yield getProfile(session.username);
            res.write(JSON.stringify(profile));
        }
    }
    res.end();
}));
app.post('/api/login', (req, res) => {
    //this is apparently wrong, just use express middleware
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password } = JSON.parse(chunk.toString());
        let status = yield login(username, password);
        if (status != null) {
            let cookie = crypto.randomUUID();
            sessions.push({ username: username, cookie: cookie });
            res.cookie('token', cookie, { maxAge: 900000, httpOnly: true });
            res.write("true");
            res.end();
        }
        else {
            //this blows
            res.write("false");
            res.end();
        }
    }));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
