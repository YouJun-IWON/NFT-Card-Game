export default function swapCards(array: string[], index1: number, index2: number): string[] | null {
  if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length) {
      console.error("Invalid indices provided.");
      return null;
  }

  // Create a copy of the array to avoid modifying the original array
  const newArray = [...array];

  // Swap elements at index1 and index2 in the copy
  const temp = newArray[index1];
  newArray[index1] = newArray[index2];
  newArray[index2] = temp;

  return newArray;
}
