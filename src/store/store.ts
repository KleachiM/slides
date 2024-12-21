import {createStore} from 'redux'
import appReducer from "./reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";

const store = createStore(appReducer)

type RootState = ReturnType<typeof appReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store