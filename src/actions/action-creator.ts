import {ActionType} from "../types/actionTypes";

export const moveElement = offset => (
    {
        type: ActionType.MOVE_ELEMENT,
        payload: offset
    }
)

export const setSelection = selection => (
    {
        type: ActionType.SET_SELECTION,
        payload: selection
    }
)