import {Block, Image, Presentation} from "../types/presentationTypes";
import * as actions from "../actions/actions";
import {ActionType} from "../types/actionTypes";
import {combineReducers} from "redux";
import {getPresentationFromJson} from "../actions/actions";
import styles from "../components/ActiveSlide/ActiveSlide.module.css"
import {isJsonValid} from "../utils/utils";
import {json} from "stream/consumers";

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
                    fontFamily: 'serif',
                    fontWeight: "normal",
                    fontStyle: 'normal',
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
                    fontFamily: 'Roboto',
                    fontWeight: "normal",
                    fontStyle: 'normal',
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
                    fontFamily: 'serif',
                    fontWeight: "normal",
                    fontStyle: 'normal',
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
                    fontFamily: 'serif',
                    fontWeight: "normal",
                    fontStyle: 'normal',
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
    let presentation = initialPresentation;
    try {
        const serializedState = localStorage.getItem('appState');

        if (serializedState && isJsonValid(serializedState)){
            presentation = JSON.parse(serializedState);
            presentation.selection = {type: 'slide', value: []}
        }

    } catch (error) {
        console.error('Failed to load state:', error);
    }
    return presentation;
};

// const initialState: StateType = {
//     presentation: initialPresentation,
//     undoStack: [],
//     redoStack: []
// }

const initialState: StateType = {
    presentation: loadStateFromLocalStorage(),
    undoStack: [],
    redoStack: []
}

function presentationReducer(state = initialState, action){
    // alert("Раскомментировать для localStorage")
    const {presentation, undoStack, redoStack} = state;
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
        case ActionType.DELETE_ELEMENT:
            return {
                presentation: actions.deleteElement(state.presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.ADD_IMAGE:
            return {
                presentation: actions.addImageBlock(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.ADD_TEXT:
            return {
                presentation: actions.addTextBlock(presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_TEXT_PROPERTY:
            return {
                presentation: actions.changeTextBlockProperty(presentation, action.payload.propName, action.payload.propValue),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_TEXT_VALUE:
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
                return state;
            }

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
        case ActionType.FROM_JSON:
            return {
                presentation: getPresentationFromJson(presentation, action.payload),
                undoStack: [],
                redoStack: []
            }
        case ActionType.SET_BACKGROUND_COLOR:
            return {
                presentation: actions.changeSlideBackground(presentation, action.payload),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.SET_BACKGROUND_IMAGE:
            const img: Image = {type: 'image', source: action.payload.source};
            return {
                presentation: actions.changeSlideBackground(presentation, img),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.CHANGE_ITALIC:
            return {
                presentation: actions.changeTextItalic(presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        case ActionType.CHANGE_BOLD:
            return {
                presentation: actions.changeTextBold(presentation),
                undoStack: [...undoStack, presentation],
                redoStack: []
            }
        default:
            return state;
    }
}

type EditorState = {
    fullscreenMode: boolean,
}

const initialEditor: EditorState = {
    fullscreenMode: false,
}

function editorReducer(state = initialEditor, action){
    switch (action.type) {
        case ActionType.FULL_SCREEN:
            const selector = styles.slide
            const elem = document.querySelector(`.${selector}`);
            elem?.requestFullscreen();
            return {
                ...state,
                fullscreenMode: true
            }
        case ActionType.EXIT_FULL_SCREEN:
            return {
                ...state,
                fullscreenMode: false
            }
        default:
            return state;
    }
}

export const appReducer = combineReducers({
    presentation: presentationReducer,
    editor: editorReducer
})

// Сохранение состояния в localStorage
export const saveStateToLocalStorage = (state: Presentation) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (error) {
        console.error('Failed to save state:', error);
    }
};
