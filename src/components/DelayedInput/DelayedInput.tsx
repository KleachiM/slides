import React, { useState, useEffect } from "react";
import {useAppActions} from "../../store/store";

type DelayedInputProps = {
    initVal: number | string
}

export function DelayedInput(props: DelayedInputProps) {
    const delay = 800;
    const [value, setValue] = useState(props.initVal);
    const [prevValue, setPrevValue] = useState(props.initVal);

    useEffect(() => {
        setValue(props.initVal);
        setPrevValue(props.initVal);
    }, [props.initVal]);

    const {changeTextProperty} = useAppActions();
    useEffect(() => {
        const handler = setTimeout(() => {
            if (value === "") {
                setValue(prevValue);
            } else {
                if (prevValue !== value){ // условие добавлено для блокирования изменения текста при dnd текстового элемента
                    console.log("calling ctp in delayed input")
                    changeTextProperty("fontSize", Number(value))
                    setPrevValue(value);
                }
            }
        }, delay);

        return () => clearTimeout(handler);
    }, [value, prevValue, delay]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
    };

    return (
        <input
            type="number"
            value={value}
            style={{border: "solid", maxWidth: "30px", textAlign: "center"}}
            onChange={handleChange}
        />
    );
}
