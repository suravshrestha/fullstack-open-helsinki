import 'dotenv/config'

export const MONGODB_URI = process.env.MONGODB_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
