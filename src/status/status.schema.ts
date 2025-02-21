import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";




export type StatusDocument = Status & Document;

@Schema()
export class Status{
    @Prop({required: true})
    name: string;

}

export const StatusSchema = SchemaFactory.createForClass(Status);