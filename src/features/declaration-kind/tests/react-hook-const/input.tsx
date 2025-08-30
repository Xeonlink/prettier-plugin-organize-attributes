import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react"


export function Test() {

    let [test, setTest] = useState(0)

    var [test1, setTest1] = useState(0)

    let [test2, dispatchTest2] = useReducer((state, action) => {
        return state + action
    }, 0)

    var [test3, setTest3] = useState(0)

    var [test4, dispatchTest4] = useReducer((state, action) => {
        return state + action
    }, 0)

    let test5 = useRef(null)

    var test6 = useRef(null)

    let test7 = useCallback(() => {
        return 0
    }, [])

    var test8 = useCallback(() => {
        return 0
    }, [])

    let test9 = useMemo(() => {
        return 0
    }, [])

    var test10 = useMemo(() => {
        return 0
    }, [])

    let test11 = useContext(null as any)

    var test12 = useContext(null as any)

    useEffect(() => {
        setTest(test + 1)
    }, [test])

    return <div>test</div>
}