import {Block, Presentation} from "../types/presentationTypes";
import * as actions from "../actions/actions";
import {ActionType} from "../types/actionTypes";
import {createStore} from "redux";

export const defaultBlock: Block = {
    id: 'id',
    point: {x: 50, y: 100},
    dimension: {width: 50, height: 50}
}

export const initialPresentation: Presentation = {
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

type StateType = {
    presentation: Presentation,
    undoStack: Array<Presentation>,
    redoStack: Array<Presentation>
}


// Загрузка состояния из localStorage
const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        return serializedState ? JSON.parse(serializedState) : initialPresentation;
    } catch (error) {
        console.error('Failed to load state:', error);
        return initialPresentation;
    }
};

const initialState: StateType = {
    presentation: initialPresentation,
    undoStack: [],
    redoStack: []
}

// const initialState: StateType = {
//     presentation: loadStateFromLocalStorage(),
//     undoStack: [],
//     redoStack: []
// }

export function appReducer(state = initialState, action){
    const {presentation, undoStack, redoStack} = state;
    console.log(`calling with action: ${action.type}`)
    switch (action.type){
        case ActionType.MOVE_ELEMENTS:
            return {
                presentation: actions.moveElementByOffset(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.RESIZE_ELEMENTS:
            return {
                presentation: actions.resizeElement(presentation, action.payload.positionOffset, action.payload.dimensionOffset),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_SELECTION:
            return {
                presentation: actions.setSelection(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_ACTIVE_SLIDE:
            return {
                presentation: actions.setActiveSlide(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.ADD_SLIDE:
            return {
                presentation: actions.addSlide(state.presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.DELETE_SLIDE:
            return {
                presentation: actions.deleteSlides(state.presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.ADD_IMAGE:
            return {
                presentation: actions.addImageBlock(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_TEXT_PROPERTY:
            return {
                presentation: actions.changeTextBlockProperty(presentation, action.payload.propName, action.payload.propValue),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.FONT_SIZE_INC_DEC:
            return {
                presentation: actions.fontSizeIncOrDec(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.CHANGE_SLIDE_POSITION:
            return {
                presentation: actions.changeSlidePosition(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.UNDO:
            if (undoStack.length === 0){
                console.log("undo length 0")
                return state;
            }

            console.log(`undoing. undo length: ${undoStack.length}`)
            const prevPres = undoStack[undoStack.length - 1];
            const newUndoStack = redoStack.slice(0, redoStack.length - 1);

            return {
                presentation: prevPres,
                undoStack: newUndoStack,
                redoStack: [presentation, ...redoStack]
            }
        case ActionType.REOO:
            if (redoStack.length === 0)
                return state;

            const newPres = redoStack[0];
            const newRedoStack = redoStack.slice(1);

            return {
                presentation: newPres,
                undoStack: [...undoStack, presentation],
                redoStack: newRedoStack
            }
        default:
            return state;
    }
}

// export default function appReducer(state = initialState, action){
//     let newPresentation;
//     const {presentation, undoStack, redoStack} = state;
//     switch (action.type){
//         case ActionType.MOVE_ELEMENTS:
//             newPresentation = actions.moveElementByOffset(presentation, action.payload);
//             break;
//         case ActionType.RESIZE_ELEMENTS:
//             newPresentation = actions.resizeElement(presentation, action.payload.positionOffset, action.payload.dimensionOffset);
//             break;
//         case ActionType.SET_SELECTION:
//             newPresentation = actions.setSelection(presentation, action.payload);
//             break;
//         case ActionType.SET_ACTIVE_SLIDE:
//             newPresentation = actions.setActiveSlide(presentation, action.payload);
//             break;
//         case ActionType.ADD_SLIDE:
//             newPresentation = actions.addSlide(state.presentation);
//             break;
//         case ActionType.DELETE_SLIDE:
//             newPresentation = actions.deleteSlides(state.presentation);
//             break;
//         case ActionType.ADD_IMAGE:
//             newPresentation = actions.addImageBlock(presentation, action.payload);
//             break;
//         case ActionType.SET_TEXT_PROPERTY:
//             newPresentation = actions.changeTextBlockProperty(presentation, action.payload.propName, action.payload.propValue);
//             break;
//         case ActionType.FONT_SIZE_INC_DEC:
//             newPresentation = actions.fontSizeIncOrDec(presentation, action.payload);
//             break;
//         case ActionType.CHANGE_SLIDE_POSITION:
//             newPresentation = actions.changeSlidePosition(presentation, action.payload);
//             break;
//         case ActionType.UNDO:
//             if (undoStack.length === 0)
//                 return state;
//
//             const prevPres = redoStack[redoStack.length - 1];
//             const newUndoStack = redoStack.slice(0, redoStack.length - 1);
//
//             return {
//                 presentation: prevPres,
//                 undoStack: newUndoStack,
//                 redoStack: [presentation, ...redoStack]
//             }
//         case ActionType.REOO:
//             if (redoStack.length === 0)
//                 return state;
//
//             const newPres = redoStack[0];
//             const newRedoStack = redoStack.slice(1);
//
//             return {
//                 presentation: newPres,
//                 undoStack: [...undoStack, newPres],
//                 redoStack: newRedoStack
//             }
//         default:
//             console.log('return default')
//             return state;
//     }
// }

// Сохранение состояния в localStorage
export const saveStateToLocalStorage = (state: Presentation) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (error) {
        console.error('Failed to save state:', error);
    }
};
