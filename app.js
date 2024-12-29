
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
// import mysql from 'mysql2'
import connetToDatabase from './db/db.js'

connetToDatabase();
dotenv.config();


const app = express();
const PORT = process.env.PORT



//routs
app.use(express.json())
app.use(cors())
app.get('/hello',(req,res)=>{
    res.send('hello this the get method')
})

app.post('/register',async(req,res)=>{
   try {
     const {username,email,password} = req.body;
          
    await connetToDatabase.query('INSERT INTO user (name,email,password) VALUES (?,?,?)',[username,email,password])
    res.send('the user is registerd successfully')
   } catch (error) {
    console.log(error)
   }
})

app.listen(PORT,()=>{
    console.log(`the server is running on port number ${PORT}`)
})