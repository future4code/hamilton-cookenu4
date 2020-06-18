import { BaseDatabase } from "../data/BaseDatabase";
import {failureMessage} from "../messages";


export class User extends BaseDatabase{

    private static TABLE_NAME:string =  "Cookenu4_Users";

    public async createUser(
        id: string,name: string,email: string,password: string)
        :Promise<void>{

            if(name.length<3){
                throw new Error(failureMessage.name);
            };

            if(email.includes("@")!==true || email.includes(".com")!==true){
                throw new Error(failureMessage.email);
            }

            await this.getConnection().insert({
                id,name,email,password
            }).into(User.TABLE_NAME);

            this.destroyConnection();
    };

    public async getUserByEmail(email:string):Promise<any>{
        const result = await this.getConnection().select("*")
        .from(User.TABLE_NAME).where({email});
        
        
        this.destroyConnection();
        return result[0];
    };

    public async getUserById(id:string): Promise<any>{
        const result = await this.getConnection().select("id", "name", "email")
        .from(User.TABLE_NAME).where({id});

        this.destroyConnection();
        return result[0];
    };
};  