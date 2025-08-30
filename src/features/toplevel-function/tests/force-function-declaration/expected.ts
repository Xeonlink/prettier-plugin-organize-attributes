export default function () {
  return 1;
}

export function Named(): number {
  return 2;
}

function Named2<const T extends { [key: string]: { named: number } }>(): {
  named: string;
} {
  return {
    named: "",
  };
}

(function (): number {
  return 4;
});
