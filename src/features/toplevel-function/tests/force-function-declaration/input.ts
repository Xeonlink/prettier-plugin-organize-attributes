export default () => {
    return 1;
}

export const Named: () => number = (): number => {
    return 2;
}

const Named2 = <const T extends { [key: string]: { named: number } }>(): { named: string } => {
    return { 
        named: "" }
}


(): number => {
    return 4;
}