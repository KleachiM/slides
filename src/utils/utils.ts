import Ajv, { JSONSchemaType } from "ajv";
import schema from "./schema.json"
import {Presentation} from "../types/presentationTypes";

export function isJsonValid(jsonContent: string): boolean{
    const ajv = new Ajv();
    const presentationSchema = schema as unknown as JSONSchemaType<Presentation>;
    const validate = ajv.compile(presentationSchema);

    const content = JSON.parse(jsonContent);
    const res = validate(content);
    if (res == true)
        console.log('valid')
    else
        console.log('not valid')
    return res;
}