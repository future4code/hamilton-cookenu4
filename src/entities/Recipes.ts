import { BaseDatabase } from "../data/BaseDatabase";
import {failureMessage} from "../messages";

export class Recipe extends BaseDatabase {
    
    private static TABLE_NAME: string = "Cookenu4_Recipes";

    public async createRecipe(
        id: string, title: string, description: string, 
        createAt: string, author_id: string      
    ): Promise <void> {
        if (title.length<3){
            throw new Error(failureMessage.name);
        };
        
        await this.getConnection().insert({
            id, title, description, createAt, author_id
        }).into(Recipe.TABLE_NAME);

        this.destroyConnection();
    };
} 