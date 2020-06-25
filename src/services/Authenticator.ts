import * as jwt from "jsonwebtoken";

export class Authenticator{
    private static EXPIRES_IN = "1y";

    public generateToken(data: AuthenticatorData):string{
        return jwt.sign(data, process.env.JWT_KEY as string,{
            expiresIn: Authenticator.EXPIRES_IN,
        });
    };

    public getData (token: string): AuthenticatorData {
        const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
        const result = {
            id: payload.id
        };
        return result;
    };
}

export interface AuthenticatorData{
    id: string;
};