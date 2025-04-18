import express from "express";
import session from "express-session";
import constructorMethod from "./routes/index.js";
import cookieParser from "cookie-parser";
import firebaseAuth from "./config/firebase.js";
import cors from "cors";
const app = express();

app.use(
  session({
    name: "AuthenticationState",
    secret: "SecretCookie",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
