import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Category } from "../category/category.schema";


export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Product {

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id: mongoose.Schema.Types.ObjectId

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