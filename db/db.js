import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

let connection

const connectTodatabse = async () => {
    if(!connection){
        connection = mysql.createConnection({
            host:process.env.HOST,
            database:process.env.DB_NAME,
            user:process.env.USER,
        })

        connection.connect((err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('the database is connected to the servere successfully')
            }
        })
    }
    return connection;
}

export default connectTodatabse