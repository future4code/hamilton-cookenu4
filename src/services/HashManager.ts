import * as bcrypt from "bcryptjs";
import {failureMessage} from "../messages";

export class HashManager {
    
    public async hash(password: string): Promise<string>{

        if(password.length<6){
            throw new Error(failureMessage.password);
        };

        const rounds = Number(process.env.BCRYPT_COST);
        const salt = await bcrypt.genSalt(rounds);
        const result = await bcrypt.hash(password, salt);

        return result;
    };
    public async compare(password: string, hash: string):Promise<boolean>{
        return await bcrypt.compare(password, hash);
    };
};
