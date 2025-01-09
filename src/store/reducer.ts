import {Block, Presentation} from "../types/presentationTypes";
import * as actions from "../actions/actions";
import {ActionType} from "../types/actionTypes";

export const defaultBlock: Block = {
    id: 'id',
    point: {x: 50, y: 100},
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
                },
                {
                    type: 'text',
                    id: `tstId3`,
                    point: {x: 440, y: 40},
                    dimension: {
                        width: 100,
                        height: 100},
                    content: 'Content in slide 1',
                    fontSize: 10,
                    fontColor: 'black',
                    fontFamily: 'Roboto'
                },
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
        },
        {
            id: '3',
            background: '',
            slideData: [
                {
                    type: 'text',
                    id: `tstId4`,
                    point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
                    dimension: {
                        width: defaultBlock.dimension.width,
                        height: defaultBlock.dimension.height},
                    content: 'Content in slide 3',
                    fontSize: 10,
                    fontColor: 'black',
                    fontFamily: 'serif'
                }
            ]
        },
    ],
    activeSlideId: '1',
    selection: {type: 'slide', value: []}
};

export default function appReducer(presentation = initialState, action){
    switch (action.type){
        case ActionType.MOVE_ELEMENTS:
            return actions.moveElementByOffset(presentation, action.payload);
        case ActionType.RESIZE_ELEMENTS:
            return actions.resizeElement(presentation, action.payload.positionOffset, action.payload.dimensionOffset);
        case ActionType.SET_SELECTION:
            return actions.setSelection(presentation, action.payload);
        case ActionType.SET_ACTIVE_SLIDE:
            return actions.setActiveSlide(presentation, action.payload);
        case ActionType.ADD_SLIDE:
            return actions.addSlide(presentation);
        case ActionType.DELETE_SLIDE:
            return actions.deleteSlides(presentation);
        case ActionType.ADD_IMAGE:
            return actions.addImageBlock(presentation, action.payload);
        case ActionType.SET_TEXT_PROPERTY:
            return actions.changeTextBlockProperty(presentation, action.payload.propName, action.payload.propValue);
        case ActionType.FONT_SIZE_INC_DEC:
            return actions.fontSizeIncOrDec(presentation, action.payload);
        default:
            return presentation;
    }
}
