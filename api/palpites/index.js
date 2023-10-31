import jwt from "jsonwebtoken"
import {prisma} from '../index.js'
const palpites=[]




export const  bet=async(req,res)=>{
 
    const {game}=req.body

    const hunche= await prisma.hunche.create({
        data:game
    })

    res.json({message:'Aposta feita com sucesso'})
}

export const listBets=async(req, res)=>{
    const user=await prisma.user.findUnique({where:{nickname:req.user.nickname}})

    if(!user){
        res.status(401).json({mesage: 'User not found on our database, login again'})
    }

    const list=await prisma.hunche.findMany({
        where:{
            userId:user.id
        },
        include:{
            game:true
        }
    })

    if(!list){
        res.status(401).json({mesage: 'Bets not found'})
    }

    res.status(201).json([...list])
}