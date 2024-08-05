import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
let login_info = [];
function logged_in(log_info) {
    let existing_login = login_info.find((info) => {
        info.username === log_info.username;
    });
    if (existing_login == null) {
        return 0;
    }
    if (existing_login.password != log_info.password) {
        return 1;
    }
    else {
        return 2;
    }
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/session', (req, res) => {
    let cookie = req.headers['cookie'];
    if (cookie) {
        res.write("logged");
    }
    else {
        res.write("not");
    }
    res.end();
});
function register(res, req) {
    var cookie = req.cookies;
    console.log(cookie);
    res.cookie('cookieName', "penisretard69", { maxAge: 900000, httpOnly: true });
    res.end();
}
app.post('/api/login', (req, res) => {
    req.on('data', (chunk) => {
        let json = JSON.parse(chunk.toString());
        login_info.push(json);
        console.log("SETTING COOKIES");
        register(res, req);
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
