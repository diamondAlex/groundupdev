import * as user from './build/user.js'

async function test_getUser(){
    let res = await user.get_user("aa")
    console.log(res)
}
test_getUser()

async function test_register(){
    let res = await user.register("aa","aa")
    console.log(res)
}

//test()
