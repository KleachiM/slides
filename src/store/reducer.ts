import {Block, Presentation} from "../types/presentationTypes";
import {Action} from "redux";

export const defaultBlock: Block = {
    id: 'id',
    point: {x: 100, y: 10},
    dimension: {width: 50, height: 50}
}

const initialState: Presentation = {
    title: 'New presentation',
    slides: [
        {
            id: '1',
            background: 'cadetblue',
            slideData: [
                {
                    type: 'text',
                    id: `tstId1`,
                    point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
                    dimension: {
                        width: defaultBlock.dimension.width,
                        height: defaultBlock.dimension.height},
                    content: 'Content in slide 1',
                    fontSize: 10,
                    fontColor: 'black',
                    fontFamily: 'serif'
                }
            ]
        },
        {
            id: '2',
            background: 'steelblue',
            slideData: [
                {
                    type: 'text',
                    id: `tstId2`,
                    point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
                    dimension: {
                        width: defaultBlock.dimension.width,
                        height: defaultBlock.dimension.height},
                    content: 'Content in slide 2',
                    fontSize: 10,
                    fontColor: 'black',
                    fontFamily: 'serif'
                }
            ]
        }
    ],
    activeSlideId: '',
    selection: {type: 'slide', value: []}
};

export default function appReducer(state = initialState, action: Action){
    switch (action.type){

        default:
            return state;
    }
}