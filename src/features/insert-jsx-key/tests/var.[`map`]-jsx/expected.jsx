const test = ["1", "2", "3", "4", "5"];

const test2 = test[`map`]((item) => (
  <div key={"TODO: insert key"} id={item} className="test-class">
    {item}
  </div>
));
