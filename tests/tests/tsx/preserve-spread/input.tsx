type PropKeys = "id" | "other" | "className" | "id_" | "other_" | "className_" ;
type Props = Record<PropKeys, string>;

function Component(_: Props) {
    return null;
}

<Component id="id" other="other" className="style" {...{}} id_="id_other_class" other_="other_class" className_="style_class"/>