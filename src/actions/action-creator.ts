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