import Ajv, { JSONSchemaType } from "ajv";
import {Presentation} from "../types/presentationTypes";
export function isJsonValid(json: string): boolean{
    const ajv = new Ajv();
    const schema: JSONSchemaType<Presentation> = json as JSONSchemaType<Presentation>;

    return true;
}