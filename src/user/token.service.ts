import jtw from 'jsonwebtoken'
import dotenv from "dotenv";
import { PrismaClient, User } from '@prisma/client';

dotenv.config()

const secretKey = process.env.JWT_ACCESS_SECRET;
const secretRefreshKey = process.env.JWT_REFRESH_SECRET;

export class TokenService {
   private token = new PrismaClient().token;

   generateToken(payload: any) {
      const accessToken = jtw.sign(payload, secretKey, { expiresIn: '30m' })
      const refreshToken = jtw.sign(payload, secretRefreshKey, { expiresIn: '30d' })
      return {
         accessToken,
         refreshToken
      }
   }
   async saveToken(userId: string, refreshToken: string ) {
   
      const tokenData = await this.token.findUnique({
         where: { userId },
      })

      if (tokenData) {
         tokenData.refreshToken = refreshToken;
         const refresh = this.token.update({
            where: { userId },
            data: {
               userId,
               refreshToken
            }
         })
         return refresh
      }

      const createToken = await this.token.create({
         data: { userId, refreshToken }
      })
      return createToken
   }
}