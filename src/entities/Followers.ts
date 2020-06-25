import { BaseDatabase } from "../data/BaseDatabase";


export class Followers extends BaseDatabase {

    private static TABLE_NAME:string =  "Cookenu4_Followers";

    public async followUser(
        user_id: string, followed_id: string
    ): Promise <void> {
        await this.getConnection().insert({
            user_id, followed_id
        }).into(Followers.TABLE_NAME);

        this.destroyConnection();
    }

    public async unfollowUser(
        user_id: string, followed_id: string
    ): Promise <void> {
        await this.getConnection().delete().where({
            user_id, followed_id
        }).from(Followers.TABLE_NAME)
    };
};