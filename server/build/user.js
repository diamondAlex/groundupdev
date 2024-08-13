//TODO
//implement error handling with reject instead of whatever the fuck you're doing right now, although I don't want to try catch all over
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createConnection } from 'mysql2';
import * as crypto from 'crypto';
//this needs to go somewhere else
const connection = createConnection({
    port: 3307,
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
});
export function get_user(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let qry = `select username from users where username = '${username}'`;
            connection.query(qry, (err, values) => {
                if (err) {
                    //this is bad
                    resolve(null);
                }
                else {
                    if (values.length != 0) {
                        resolve(values[0].username);
                    }
                    else {
                        resolve(null);
                    }
                }
            });
        });
    });
}
export function getPassword(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            connection.query(`select password from users where username = '${username}';`, (err, values) => {
                if (err) {
                    resolve(null);
                }
                else {
                    if (values.length != 0) {
                        resolve(values[0].password);
                    }
                    else {
                        resolve(null);
                    }
                }
            });
        });
    });
}
export function register(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let hashedPass = crypto.createHash('sha256').update(password + process.env.SALT).digest('base64');
        let user = yield get_user(username);
        return new Promise((resolve, reject) => {
            if (user != null) {
                //user found
                resolve(null);
                return;
            }
            let qry = `insert into 
        users(username,password) 
        values('${username}','${hashedPass}')`;
            connection.query(qry, (err, values) => {
                if (err) {
                    resolve(null);
                }
                else {
                    resolve(values);
                }
            });
        });
    });
}
export function getSession() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
//fix the returns here as it is dogshit
export function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let hashedPass = crypto.createHash('sha256').update(password + process.env.SALT).digest('base64');
        let loginInfo = yield getPassword(username);
        if (!loginInfo) {
            return null;
        }
        else {
            if (hashedPass == loginInfo) {
                return 1;
            }
            else {
                return null;
            }
        }
    });
}
