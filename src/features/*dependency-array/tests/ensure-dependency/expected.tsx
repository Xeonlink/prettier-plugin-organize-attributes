import { useEffect, useState } from "react";

type Props = {
  prop0: string;
  prop1: string;
};

export function Test(props: Props) {
  const { prop0: test0, prop1: test1 } = props;

  const test = "test";
  const [test2, setTest2] = useState(test);
  const [test3, setTest3] = useState(test);

  useEffect(() => {
    setTest2(test1);
  }, [test3]);

  return <div>test</div>;
}
