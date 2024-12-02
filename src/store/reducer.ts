import {Presentation} from "../types/presentationTypes";
import {Action} from "redux";

const initialState: Presentation = {
    title: 'New presentation',
    slides: [
        {
            id: '1',
            background: 'transparent',
            slideData: []
        },
        {
            id: '2',
            background: 'azure',
            slideData: []
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