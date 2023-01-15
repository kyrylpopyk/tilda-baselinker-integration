import express from "express";
import dotenv from "dotenv";
import process from "process";
import cosmeticsOrdersRouter from "./routers/cosmeticsOrdersRouter";
import cors, {CorsOptions} from "cors";
import errorHandler from "./helpers/errorHandler";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

const corsOption: CorsOptions = {
    origin: ["pl.robeauty.me", "hu.robeauty.me"]
}
app.use(cors(corsOption));
app.use(express.json());

app.use("/api/cosmetics", cosmeticsOrdersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server was started with port ${PORT}`);
})