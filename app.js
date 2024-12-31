//the import module starting method
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
dotenv.config();
const app = express();
const PORT = process.env.PORT
//the import method ending point

//database connection starting point
const dbconnection =mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:"",
    database:process.env.DB_NAME
}).promise();

//database connection ending point

//middle ware starting point
app.use(express.json())
app.use(cors())

//middle ware ending point

//the registered method starting point
app.post('/register',async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.send('please enter all fields')
    }
   try {
     const [result] = await dbconnection.query('SELECT name FROM user where name=? or email = ?',[username,email])
    if(result.length>0){
        return res.send('the user already registered')
    }
    if(password.length<8){
        return res.send('the password must be at least 8')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password,salt)
    await dbconnection.query('INSERT INTO user (name,email,password) VALUES (?,?,?)',[username,email,hashedpassword])
    return res.send('the user registered successfully')
   } 
   catch (error) {
    console.log(error)
   }
    
})

//the registered method ending method

//the login method starting point

app.post('/login',async(req,res)=>{
   const {email,password} = req.body;
   if(!email || !password){
    return res.send('please enter all requerd fields')
   }
   try {
    const [result] = await dbconnection.query('select name,password from user where email=?',[email])
    if(result.length===0){
        return res.send('the input is invalid')
    }
    const ismatch = await bcrypt.compare(password,result[0].password)
    if(!ismatch){
        return res.send('the password is invalid')
    }
    
    const username1=result[0].username

    const secret_key = process.env.SECRETE_KEY;
    
    const token = jwt.sign({username1},secret_key)
    return res.send({msg:'the user is registered successfully',token})

   } catch (error) {
    console.log(error)
   }
})
//the login method starting point


app.listen(PORT,()=>{
    console.log(`the server is running on port number ${PORT}`)
})