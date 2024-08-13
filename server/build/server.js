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
import { register, login } from './user.js';
// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
let sessions = [];
//is this still relevant?
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
function clearCookie(res) {
    res.setHeader('set-cookie', "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
}
app.post('/api/logout', (req, res) => {
    clearCookie(res);
    res.end();
});
//add sessions
app.get('/api/session', (req, res) => {
    console.log('session');
    let cookie_header = req.headers['cookie'];
    if (cookie_header) {
        //make an extract cookie function instead
        let cookie = cookie_header.split("=")[1];
        let logged = sessions.find((e) => {
            return e.cookie == cookie;
        });
        console.log(logged);
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
    console.log("signup");
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
app.post('/api/login', (req, res) => {
    req.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password } = JSON.parse(chunk.toString());
        let status = yield login(username, password);
        if (status != null) {
            let cookie = crypto.randomUUID();
            sessions.push({ username: username, cookie: cookie });
            console.log(sessions);
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
