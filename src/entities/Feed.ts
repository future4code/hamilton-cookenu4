import { BaseDatabase } from "../data/BaseDatabase";


export class Feed extends BaseDatabase {

    private static TABLE_NAME: string = "Cookenu4_Recipes";
    private static TABLE_NAME2: string = "Cookenu4_Followers";
    private static TABLE_NAME3: string = "Cookenu4_Users";


    public async getFeed(userId: string): Promise <any> {
      const result = await this.getConnection().raw (
           `
           SELECT ${Feed.TABLE_NAME}.id, ${Feed.TABLE_NAME}.title, 
           ${Feed.TABLE_NAME}.description, ${Feed.TABLE_NAME}.createAt,
           ${Feed.TABLE_NAME}.author_id, ${Feed.TABLE_NAME3}.name
           FROM ${Feed.TABLE_NAME2}
           INNER JOIN ${Feed.TABLE_NAME} ON followed_id = ${Feed.TABLE_NAME}.author_id
           JOIN ${Feed.TABLE_NAME3} ON ${Feed.TABLE_NAME}.author_id = ${Feed.TABLE_NAME3}.id
           WHERE user_id = "${userId}";
           `
       )
       this.destroyConnection()

       return result[0]
    };
};