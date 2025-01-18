import Ajv, { JSONSchemaType } from "ajv";
import schema from "./schema.json"
import {Image, Presentation} from "../types/presentationTypes";

export function isJsonValid(jsonContent: string): boolean{
    const ajv = new Ajv();
    const presentationSchema = schema as unknown as JSONSchemaType<Presentation>;
    const validate = ajv.compile(presentationSchema);

    const content = JSON.parse(jsonContent);
    const res = validate(content);

    return res;
}

export function backGroundTypeIsImage(background): boolean {
    return (background as Image).type === 'image';
    // return (
    //     typeof background === 'object' &&
    //     background !== null &&
    //     'type' in background &&
    //     (background as Image).type === 'image'
    // );
};