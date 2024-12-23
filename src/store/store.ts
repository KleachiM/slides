import {bindActionCreators, createStore} from 'redux'
import appReducer from "./reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import * as AppActionCreators from "../actions/action-creator"

const store = createStore(appReducer)

type RootState = ReturnType<typeof appReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(AppActionCreators, dispatch);
}
export default store