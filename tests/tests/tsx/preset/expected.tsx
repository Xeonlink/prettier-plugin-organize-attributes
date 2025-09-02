type PropKeys = "id" | "other" | "className";
type Props = Record<PropKeys, string>;

function Component(_: Props) {
  return null;
}

<Component className="style" id="id" other="other" />;
