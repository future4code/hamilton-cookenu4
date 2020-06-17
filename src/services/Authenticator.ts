import * as jwt from "jsonwebtoken";

export class Authenticator{
    private static EXPIRES_IN = "1y";

    public generateToken(data: AuthenticatorData):string{
        return jwt.sign(data, process.env.JWT_KEY as string,{
            expiresIn: Authenticator.EXPIRES_IN,
        });
    };
}

export interface AuthenticatorData{
    id: string;
};