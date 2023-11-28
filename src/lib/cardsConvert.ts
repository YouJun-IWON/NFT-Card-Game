interface OriginalObject {
  [key: string]: string;
}

interface Card {
  id: string;
  name: string;
  shape: string;
  num: string;
}

export default function convertToCards(originalObject: OriginalObject): Card[] {
  const suits = ['spade', 'heart', 'club', 'diamond'];
  const ranks = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];

  return Object.entries(originalObject).map(([id, name], index) => {
    const suitIndex = Math.floor(index / ranks.length);
    const rankIndex = index % ranks.length;

    const shape = suits[suitIndex];
    const num = ranks[rankIndex];

    return { id, name, shape, num };
  });
}
