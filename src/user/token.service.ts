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

   validationAccessToken(accessToken: string) {
      try {
         const userData = jtw.verify(accessToken, secretKey)
         return userData
      } catch (e) {
         return null
      }
   }
   validationRefreshToken(refreshToken: string) {
      try {
         const userData = jtw.verify(refreshToken, secretRefreshKey)
         return userData
      } catch (e) {
         return null
      }
   }

   async saveToken(userId: string, refreshToken: string) {

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

   async removeToken(refreshToken: string) {
      const tokenData = this.token.delete({
         where: {
            refreshToken
         },
      })
      return tokenData;
   }
   async findToken(refreshToken: string) {
      const tokenData = this.token.findUnique({
         where: {
            refreshToken
         },
      })
      return tokenData;
   }
}