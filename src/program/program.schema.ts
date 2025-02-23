import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



export type ProgramDocument = Program & Document;

@Schema()
export class Program{
    @Prop({required: true})
    name: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);