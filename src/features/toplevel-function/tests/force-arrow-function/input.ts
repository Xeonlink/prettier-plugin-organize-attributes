/**
 * comment1
 */

export default function () {
    return 1;
}

export function Named<T extends string>(test: T): number {
    return 2;
}


function Named2<const T extends { [key: string]: { named: number }}>(test: T): { named: string } {

    return {
        named: ""
    };
}


(function () {
    return 4;
  });
  