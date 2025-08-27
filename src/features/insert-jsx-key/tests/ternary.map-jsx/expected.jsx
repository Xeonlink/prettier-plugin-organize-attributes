const test = ["1", "2", "3", "4", "5"];

const test1 = [1, 2, 3, 4, 5];

function SimpleJSx() {
  return (
    <div>
      {(test1.length > 0 ? test1 : test).map((item) => (
        <div key={"TODO: insert key"} id={item} className="test-class">
          {item}
        </div>
      ))}
    </div>
  );
}
