import * as user from './server/build/user.js'

async function test_setProfile(){
    let profile = {
        username: "test",
        name:"test",
        lastname: "test",
        description: "test",
        education: "test"
    }

    let res = await user.setProfile(profile);
    console.log(res)
}
test_setProfile()

async function test_getProfile(){
    let res = await user.getProfile("aa");
    console.log(res)
}

async function test_getUser(){
    let res = await user.get_user("aa")
    console.log(res)
}
//test_getUser()

async function test_register(){
    let res = await user.register("aa","aa")
    console.log(res)
}

//test()
