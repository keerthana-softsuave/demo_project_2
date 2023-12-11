import { pool } from "../config/configure"
import { Request, Response } from 'express'
import * as admin from "firebase-admin";


import { credential } from "../config/service-account";

admin.initializeApp({
    credential: admin.credential.cert(credential)
})

const firestore: admin.firestore.Firestore = admin.firestore();

interface userInfo {
    roles: string;
    name: string;
    deviceId: string,
    email: String,
    password: String,
    phoneNumber: number
}

const posted = (req: Request, res: Response) => {

    const { roles, name, deviceId, email, password, phoneNumber } = req.body
    const user: userInfo = {
        roles: roles,
        name: name,
        deviceId: deviceId,
        email: email,
        password: password,
        phoneNumber: phoneNumber
    }
    pool.query(`insert into user (roles, name, deviceId, email, password, phoneNumber) values ('${user.roles}', '${user.name}', '${user.deviceId}', '${user.email}', '${user.password}', '${user.phoneNumber}')`, (err: any, result: any) => {
        if (err) {
            return res.status(400).send({ message: err })
        }
        else {
            return res.status(200).send({ message: result })
        }
    })
}

interface test {
    email: string
}
const getDetails = (req: Request, res: Response) => {
    // const email : any = req.body
    const { email } = req.body
    const t: test = {
        email: email
    }
    pool.query(`select * from user where email = '${t.email}'`, (err: any, result: any) => {
        if (err) {
            return res.status(400).send({ message: err })
        }
        else {
            return res.json(result)
        }
    })
}

interface UserDetails {
    name: string,
    email: string
}

const update = async (req: Request, res: Response) => {
    const { name, email } = req.body
    const user: UserDetails = {
        name: name,
        email: email
    }
    console.log(name)
    pool.query(`update user set name =${user.name} where email = ${user.email} `, (err: any, result: any) => {
        if (err) {
            return res.json(err)
        }
        else {
            return res.json(result)
        }
    })
}

interface cred {
    email: string,
    password: string
}
const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user: cred = {
            email: email,
            password: password
        }
        if (!user.email && !user.password) {
            return res.status(400).json({ Message: "please enter email and password" })
        }
        else {
            //    const result = admin.auth().createUser({
            //         email : user.email,
            //         password : user.password,
            //         emailVerified : false,

            //     })
            //     return res.status(200).send({Message :result })
            // let userDetails;
            const id = await admin.auth().createUser({
                email: user.email,
                password: user.password,
                emailVerified: false,

            });
            // .then((data) => {
            //     userDetails = data;
            //     return res.status(200).json({ data: userDetails.uid })
            // }).catch((error) => {
            //     return res.status(200).json({ data: error })
            // })
            const snapshot = await firestore.collection('user').doc(id.uid).set(user);
            // const snapshot = await firestore.collection('user').add(user);
            return res.status(200).json({ data: snapshot });
        }
    } catch (error) {
        return res.status(200).json({ error: error });
    }
}

interface loginDetails {
    email: string,
    password: string
}

// const signIn = (req: Request, res: Response) => {
//     const { email, password } = req.body
//     const cred: loginDetails = {
//         email: email,
//         password: password
//     }
//     if (!email && !password) {
//         return res.status(400).send({ Message: "Please enter both Email and Password" })
//     }
//     else {
//            admin.auth().signInWithEmailAndPassword()
//     }
// }
interface Password {
    uid: string,
    password: string
}
const updateById = async (req: Request, res: Response) => {
    const { uid, newPassword } = req.body
    const user: Password = {
        uid: uid,
        password: newPassword
    }

    await admin.auth().updateUser(user.uid, {
        password: user.password
    }).then((data) => {
        return res.status(200).json({ data: data })
    }).catch((error) => { return res.status(200).json({ data: error }) })
}


export { posted, getDetails, update, signUp, updateById }