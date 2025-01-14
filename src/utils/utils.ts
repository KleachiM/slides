import Ajv, { JSONSchemaType } from "ajv";
import {Block, Dimension, Point, Presentation} from "../types/presentationTypes";
import {type} from "node:os";

// const point: JSONSchemaType<Point> = {
//     type: "object",
//     properties: {
//         x: {type: "integer"},
//         y: {type: "integer"}
//     },
//     required: ["x", "y"],
// }
//
// const dimension: JSONSchemaType<Dimension> = {
//     type: "object",
//     properties: {
//         width: {type: "integer"},
//         height: {type: "integer"}
//     },
//     required: ["width", "height"],
// }
//
// const block: JSONSchemaType<Block> = {
//     type: "object",
//     properties: {
//         id: {type: "string"},
//         point: {type: point},
//         dimension: {type: dimension}
//     },
//     required: ["id", "point", "dimension"]
// }

export function isJsonValid(jsonContent: string): boolean{
    // const schema: JSONSchemaType<Presentation> = {
    //     type: "object",
    //     properties: {
    //         title: {type: "string"},
    //         slides: {
    //             type: "array",
    //             items: {
    //                 type: "object",
    //                 properties: {
    //                     id: {type: "string"},
    //                     background: {},
    //                     slideData: {
    //                         type: "array",
    //                         items: {
    //
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         activeSlideId: {type: "string"},
    //         selection: {
    //             type: "object",
    //             properties: {
    //
    //             }
    //         }
    //     }
    // }

    return true;
}