import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

export function Test() {
  const [test, setTest] = useState(0);

  const [test1, setTest1] = useState(0);

  const [test2, dispatchTest2] = useReducer((state, action) => {
    return state + action;
  }, 0);

  const [test3, setTest3] = useState(0);

  const [test4, dispatchTest4] = useReducer((state, action) => {
    return state + action;
  }, 0);

  const test5 = useRef(null);

  const test6 = useRef(null);

  const test7 = useCallback(() => {
    return 0;
  }, []);

  const test8 = useCallback(() => {
    return 0;
  }, []);

  const test9 = useMemo(() => {
    return 0;
  }, []);

  const test10 = useMemo(() => {
    return 0;
  }, []);

  const test11 = useContext(null as any);

  const test12 = useContext(null as any);

  useEffect(() => {
    setTest(test + 1);
  }, [test]);

  return <div>test</div>;
}
