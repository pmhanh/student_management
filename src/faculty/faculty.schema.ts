import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";




export type FacultyDocument = Faculty & Document;

@Schema()
export class Faculty{
    @Prop({required: true})
    name: string;

}

export const FacultySchema = SchemaFactory.createForClass(Faculty);