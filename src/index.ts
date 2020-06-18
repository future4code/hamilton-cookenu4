import express, {Request, Response} from "express";
import {AddressInfo} from "net";
import dotenv from "dotenv";

import {Authenticator} from "./services/Authenticator";
import {IdGenerator} from "./services/IdGenerator";
import {HashManager} from "./services/HashManager";
import {User} from "./entities/User";
import{sucessMessage, failureMessage} from "./messages";

dotenv.config();
const app = express();
app.use(express.json());

const server = app.listen(process.env.PORT || 3000, ()=>{
    if(server){
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhos:${address.port}`);
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






    // async function teste(){
    //     const testeLogin = await new User().getUserByEmail("chesperito5@sbt.com");

    //     console.log(testeLogin);
    // }

    // teste();
};

main();

