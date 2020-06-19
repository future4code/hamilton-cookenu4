import { BaseDatabase } from "../data/BaseDatabase";
import {failureMessage} from "../messages";
import  moment  from "moment"

export class Recipe extends BaseDatabase {
    
    private static TABLE_NAME: string = "Cookenu4_Recipes";

    public async createRecipe(
        id: string, title: string, description: string, 
         author_id: string      
    ): Promise <void> {
        if (title.length<3){
            throw new Error(failureMessage.name);
        };
        
        const createAt = moment().format("DD/MM/YYYY");

        await this.getConnection().insert({
            id, title, description, createAt, author_id
        }).into(Recipe.TABLE_NAME);

        this.destroyConnection();

    };

    public async getRecipeById(id: string): Promise<any> {
        const result = await this.getConnection().select("*")
        .from(Recipe.TABLE_NAME).where({id});

        this.destroyConnection();
        return result[0];
        
    }; 
};