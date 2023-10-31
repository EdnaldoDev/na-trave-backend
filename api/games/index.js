import { prisma } from "../index.js"



export const list=async(req, res)=>{
    const games= await prisma.game.findMany()

    if(games){
      res.json(games)
    }else{
      res.status(404),json({message:'Jogos ão encontrados'})
    }
}