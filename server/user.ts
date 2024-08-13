//TODO
//implement error handling with reject instead of whatever the fuck you're doing right now, although I don't want to try catch all over
//

import { createConnection, RowDataPacket } from 'mysql2';
import * as crypto from 'crypto'

//this needs to go somewhere else
const connection = createConnection({
    port:3307,
    host:"localhost",
    user:"user",
    password:"password",
    database:"db"
})

export async function get_user(username: string){
    return new Promise((resolve,reject) => {
        let qry = `select username from users where username = '${username}'`
        connection.query<RowDataPacket[]>(qry,
        (err,values) => {
            if(err){
                //this is bad
                resolve(null)
            }
            else{
                if(values.length != 0){
                    resolve(values[0].username)
                }
                else{
                    resolve(null)
                }
            }
        })
    })
}

export async function getPassword(username: string){
    return new Promise((resolve,reject) => {
        connection.query<RowDataPacket[]>(`select password from users where username = '${username}';`,
        (err,values) => {
            if(err){
                resolve(null)
            }
            else{
                if(values.length != 0){
                    resolve(values[0].password)
                }
                else{
                    resolve(null)
                }
            }
        })
    })


}

export async function register(username: string, password: string){
    let hashedPass = crypto.createHash('sha256').update(password+process.env.SALT).digest('base64')
    let user = await get_user(username)

    return new Promise((resolve,reject) => {
        if(user != null){
            //user found
            resolve(null)
            return
        }
        let qry = `insert into 
        users(username,password) 
        values('${username}','${hashedPass}')`

        connection.query(qry,
             (err,values) => {
                 if(err){
                     resolve(null)
                 }
                 else{
                     resolve(values)
                 }
             })
    })

}

export async function getSession(){
    
}

//fix the returns here as it is dogshit
export async function login(username: string, password: string){
    let hashedPass = crypto.createHash('sha256').update(password+process.env.SALT).digest('base64')
    let loginInfo = await getPassword(username)
    if(!loginInfo){
        return null
    }
    else{
        if(hashedPass == loginInfo){
            return 1
        }
        else{
            return null
        }
    }
}
