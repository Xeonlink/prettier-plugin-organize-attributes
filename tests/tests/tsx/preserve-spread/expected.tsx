type PropKeys = "id" | "other" | "className" | "id_" | "other_" | "className_";
type Props = Record<PropKeys, string>;

function Component(_: Props) {
  return null;
}

<Component
  className="style"
  id="id"
  other="other"
  {...{}}
  className_="style_class"
  id_="id_other_class"
  other_="other_class"
/>;
