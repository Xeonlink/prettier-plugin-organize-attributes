export function SimpleTest() {
  return (
    <div>
      <div style="color: red;">Hello</div>

      <img src={""} alt="" />

      <div style={{ color: "red" }}>Hello</div>

      <img src={""} alt="" style={{ color: "red" }} />

      <button style="color: red;" onClick={() => {}}>
        Hello
      </button>
      <button style="color: red;" onClick={() => {}}>
        Hello
      </button>

      <ul>
        <li className={"item"}></li>
        <li></li>
        <li></li>
        <li className={"item"}></li>
        <li className={"item"}></li>
      </ul>
    </div>
  );
}
