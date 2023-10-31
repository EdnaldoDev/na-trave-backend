import  jwt from "jsonwebtoken"
import  * as  bcrypt from 'bcrypt'
import { prisma } from "../index.js"

export const signUp =async(req, res)=>{ 
    console.log(req.body)

    const {email, name, nickname, password} = req.body

    // verifficar se existe usuario
    const user=await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(user){
        res.status(401).json({message:'User allredy exist'})
    }

    // criptografia da senha
    const hashedPassword= await bcrypt.hash(password, 15)

    // generate jwt token
    const token = jwt.sign({nickname}, 'testeAplication_natrave_2023', {expiresIn:'210h'} )

    // salva usuario no armazenamento temporario
    try{
        const createUser= await prisma.user.create({
            data:{
                email,name,nickname, password:hashedPassword
            }
        })
    
        res.status(201).json({
            token,
            nickname,
            userId:createUser.id,
            message: 'User registered successfully'
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}


export const login = async(req, res) =>{    
    const {nickname, password}=req.body

   try{
     // find a user in DB
     const user= await prisma.user.findUnique({
        where:{
            nickname
        }
    })

    if(!user){
        return res.status(401).json({message:'User not found'})
    }

    // verify password
    const passwordMatch= await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        return res.status(401).json({message:'Invalid password'})
    }

    // generate jwt token
    const token = jwt.sign({nickname}, 'testeAplication_natrave_2023', {expiresIn:'2h'} )


    res.status(201).json({
        token,
        nickname,
        userId:user.id,
        message: 'Login successfully'
    })
   }catch(err){
    res.status(400).json({message:err.message})
   }
}