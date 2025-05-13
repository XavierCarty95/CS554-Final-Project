import express from "express";
import session from "express-session";
import constructorMethod from "./routes/index.js";
import cookieParser from "cookie-parser";
import firebaseAuth from "./config/firebase.js";
import cors from "cors";
import { connectRedis } from "./config/connectRedis.js";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";

const app = express();

connectRedis()
  .then(() => console.log("Redis initialized"))
  .catch((err) => console.error("Failed to initialize Redis:", err));

const httpServer = createServer(app);

initializeSocket(httpServer);

app.use(
  session({
    name: "AuthenticationState",
    secret: "SecretCookie",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600_000, // 10 min
      sameSite: "lax", // ok if you stay on http for dev
      // sameSite:"none", secure:true would be needed on HTTPS
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://ec2-18-188-192-217.us-east-2.compute.amazonaws.com:5173",
//   process.env.FRONTEND_URL,
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // This needs to be true to allow credentials
    optionsSuccessStatus: 200,
  })
);

const initialiseFirebase = firebaseAuth;

// app.use((req, res, next) => {
//   let str = "Non Authenticated User";
//   if (req.session.AuthCookie) {
//     str = "Authenticated User";
//   }
// });

constructorMethod(app);

httpServer.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
