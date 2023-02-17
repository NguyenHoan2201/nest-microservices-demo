import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Category } from "../category/category.schema";


export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }] })
    categories: Category[];

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ required: true })
    img: string;

    @Prop({ required: true })
    imageUrl: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);