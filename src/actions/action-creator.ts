import {ActionType} from "../types/actionTypes";

export const moveElement = offset => (
    {
        type: ActionType.MOVE_ELEMENTS,
        payload: offset
    }
)

export const resizeElement = (positionOffset, dimensionOffset) => (
    {
        type: ActionType.RESIZE_ELEMENTS,
        payload: {positionOffset: positionOffset, dimensionOffset: dimensionOffset}
    }
)

export const setSelection = selection => (
    {
        type: ActionType.SET_SELECTION,
        payload: selection
    }
)

export const setActiveSlide = slideId => (
    {
        type: ActionType.SET_ACTIVE_SLIDE,
        payload: slideId
    }
)

export const addSlide = () => (
    {
        type: ActionType.ADD_SLIDE
    }
)

export const deleteSlide = () => (
    {
        type: ActionType.DELETE_SLIDE
    }
)

export const addImage = src => (
    {
        type: ActionType.ADD_IMAGE,
        payload: src
    }
)

export const changeTextProperty = (propName, propValue) => (
    {
        type: ActionType.SET_TEXT_PROPERTY,
        payload: {propName, propValue}
    }
)

export const changeFontSize = (needToInc: boolean) => (
    {
        type: ActionType.FONT_SIZE_INC_DEC,
        payload: needToInc
    }
)

export const setBackgroundColor = (color) => (
    {
        type: ActionType.SET_BACKGROUND_COLOR,
        payload: color
    }
)

export const setBackgroundImage = (src) => (
    {
        type: ActionType.SET_BACKGROUND_COLOR,
        payload: src
    }
)

export const changeItalic = () => (
    {
        type: ActionType.CHANGE_ITALIC
    }
)

export const changeUnderline = () => (
    {
        type: ActionType.CHANGE_UNDERLINE
    }
)

export const changeBold = () => (
    {
        type: ActionType.CHANGE_BOLD
    }
)

export const changeSlidePosition = (index) => (
    {
        type: ActionType.CHANGE_SLIDE_POSITION,
        payload: index
    }
)

export const undo = () => (
    {
        type: ActionType.UNDO
    }
)

export const redo = () => (
    {
        type: ActionType.REOO
    }
)

export const toJson = () => (
    {
        type: ActionType.TO_JSON
    }
)

export const fromJson = () => (
    {
        type: ActionType.FROM_JSON
    }
)

export const toPdf = () => (
    {
        type: ActionType.TO_PDF
    }
)