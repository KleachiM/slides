import {bindActionCreators, createStore} from 'redux'
import {appReducer, saveStateToLocalStorage} from "./reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import * as AppActionCreators from "../actions/action-creator"

const store = createStore(appReducer);

// Подписка на изменения Store
store.subscribe(() => {
    saveStateToLocalStorage(store.getState().presentation);
});

type RootState = ReturnType<typeof appReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(AppActionCreators, dispatch);
}
export default store