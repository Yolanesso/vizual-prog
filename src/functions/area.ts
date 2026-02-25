export function calculateArea(shape: "circle", radius: number): number;
export function calculateArea(shape: "square", side: number): number;
export function calculateArea(
  shape: "circle" | "square",
  param: number,
): number {
  if (shape === "circle") {
    return Number((Math.PI * param * param).toFixed(2));
  } else {
    return param * param;
  }
}
