import express, {Request, Response} from "express";
import {AddressInfo} from "net";
import dotenv from "dotenv";

import {Authenticator} from "./services/Authenticator";
import {IdGenerator} from "./services/IdGenerator";
import {HashManager} from "./services/HashManager";
import {User} from "./entities/User";
import{sucessMessage, failureMessage} from "./messages";
import { Recipe } from "./entities/Recipes";
import  moment  from "moment"
import { title } from "process";


dotenv.config();
const app = express();
app.use(express.json());

const server = app.listen(process.env.PORT || 3000, ()=>{
    if(server){
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`);
    }else{
        console.error(`Failure upon starting server.`);
    };
});

function main(){    

    app.post("/signup", async (req: Request, res: Response)=>{
        try{       
            const id = new IdGenerator().generate();
            const hashPassword = await new HashManager().hash(req.body.password);

            const newUser = await new User().createUser(
                id,
                req.body.name,
                req.body.email,
                hashPassword
            );

            const token = new Authenticator().generateToken({id});

            console.log(sucessMessage.createUser);
            res.status(200).send({token});

        }catch (error){
            res.status(400).send({
                message: error.message
            });
        };
    });

    app.post("/login", async (req: Request, res: Response)=>{
        try{
            const userData = await new User().getUserByEmail(req.body.email);
            
            if(!userData){
                throw new Error(failureMessage.getUser);
            };

            const autorization = await new HashManager().compare(
                req.body.password, userData.password
            );

            if(autorization){
                const id = userData.id;
                const token = new Authenticator().generateToken({id});
                console.log(sucessMessage.login);
                res.status(200).send(token);

            }else{
                throw new Error(failureMessage.login);
            };

        }catch (error){
            res.status(400).send({
                message:error.message
            });
        };
    })

    app.get("/user/profile", async (req: Request, res: Response) => {
        try {
            const token = req.headers.auth as string;
            const getData = new Authenticator().getData(token);

        const getUser = await new User().getUserById(getData.id);
        
        res.status(200).send(getUser);                                
        } catch(err){
        res.status(400).send({
            message: err.message,
        });
        };
    });

    app.get("/user/:id", async (req: Request, res: Response) => {
        try{
            const token = req.headers.auth as string;
            const id = req.params.id as string;

            const getAuthorization = new Authenticator().getData(token);

            const getUser = await new User().getUserById(id);

            if (!getUser) {
                throw new Error ("Tem essa pessoa aqui não");
            }

            res.status(200).send(getUser)
            
        } catch(err) {
            res.status(400).send({
                message: err.message,
            })
        }
    })

    app.post("/recipe", async (req: Request, res: Response) => {
        try {

            const token = req.headers.auth as string;
            const authenticator = new Authenticator;
            const authorId = authenticator.getData(token);
            const id = new IdGenerator().generate();
          
            const createAt = moment().format("DD/MM/YYYY")
            const {title, description} = req.body
            const newRecipe = await new Recipe().createRecipe(
                id,
                title,
                description,
                createAt,
                authorId.id
            );
                res.status(200).send({title, description})

        } catch(err) {
            res.status(400).send({
                message: err.message,
            })
        }
    })


}
main();