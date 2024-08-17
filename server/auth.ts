import connection from './db.js'
import { RowDataPacket } from 'mysql2'

export interface Session{
    username:string,
    cookie:string
}

export async function removeSession(cookie: string) : Promise<boolean>{
    return new Promise((resolve,reject) => {
        let qry = `delete from sessions where cookie = '${cookie}'`
        connection.query<RowDataPacket[]>(qry,
            (err,_) => {
                if(err){
                    //this is bad
                    resolve(false)
                }
                else{
                    resolve(true)
                }
            })
    })
}

export async function setSession(session: Session) : Promise<boolean>{
    return new Promise((resolve,reject) => {
        let qry = `insert into sessions(username,cookie) values('${session.username}','${session.cookie}')`
        connection.query<RowDataPacket[]>(qry,
            (err,values) => {
                if(err){
                    //this is bad
                    resolve(false)
                }
                else{
                    if(values.length != 0){
                        resolve(true)
                    }
                    else{
                        resolve(false)
                    }
                }
            })
    })
}
export async function getSession(cookie: string) : Promise<Session | null>{
    return new Promise((resolve,reject) => {
        let qry = `select username,cookie  from sessions where cookie = '${cookie}'`
        connection.query<RowDataPacket[]>(qry,
            (err,values) => {
                if(err){
                    //this is bad
                    resolve(null)
                }
                else{
                    if(values.length != 0){
                        resolve(values[0] as Session)
                    }
                    else{
                        resolve(null)
                    }
                }
            })
    })
}

