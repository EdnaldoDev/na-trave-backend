import Express from 'express'
import cors from 'cors'
import { list } from "./games/index.js";
import { app } from "./setup.js";
import * as user from "./User/index.js"
import * as hunche from './palpites/index.js';

import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';

export const prisma= new PrismaClient()

const PORT= process.env.PORT || 9865

app.use(Express.json())

app.use(cors({origin: 'https://na-trave.vercel.app'}))

app.use((req, res, next)=>{
    res.setHeader('Content-Type', 'application/json');
    next()
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401); // Não autorizado
    }
  
    jwt.verify(token, 'testeAplication_natrave_2023', (err, user) => {
      if (err) {
        return res.sendStatus(403); // Proibido
      }
      req.user = user;
      next();
    });
  }


app.get('games', list)
app.post('bet',authenticateToken, hunche.bet)

app.post('signup', user.signUp)
app.post('login', user.login)

app.get('mybets', authenticateToken, hunche.listBets)

app.listen(PORT, ()=>console.log('Server rruning on port' + PORT))