import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js'
import quizRoutes from './routes/quiz.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import orderRoute from './routes/order.route.js' 
import returnRoutes from './routes/return.route.js'

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute); 
app.use('/api/orders', orderRoute); 
app.use('/api/returns', returnRoutes);

export default app;
