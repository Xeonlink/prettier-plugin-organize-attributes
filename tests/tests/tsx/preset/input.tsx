type PropKeys = "id" | "other" | "className" ;
type Props = Record<PropKeys, string>;

function Component(_: Props) {
    return null;
}

<Component  
id="id" other="other" className="style" />