const CARD_VALUES = [
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
const CARD_SUITS = ['H', 'D', 'S', 'C'];

// 7-7-1-37 -> 52
function Cardlist(): string[] {
  const cards: string[] = [];
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 4; j++) {
      const card = `${CARD_VALUES[i]}${CARD_SUITS[j]}`;
      cards.push(card);
    }
  }
  return cards;
}
// 예상되는 결과: ['AH', 'AD', 'AS', 'AC', '2H', '2D', '2S', '2C', '3H', '3D', '3S', '3C', '4H', '4D', '4S', '4C', '5H', '5D', '5S', '5C', '6H', '6D', '6S', '6C', '7H', '7D', '7S', '7C', '8H', '8D', '8S', '8C', '9H', '9D', '9S', '9C', '10H', '10D', '10S', '10C', 'JH', 'JD', 'JS', 'JC', 'QH', 'QD', 'QS', 'QC', 'KH', 'KD', 'KS', 'KC']

function PickSevenCardsFromList(cardlist: string[]): string[] {
  const cards: string[] = [];
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * cardlist.length);
    const card = cardlist[randomIndex];
    cards.push(card);
    cardlist.splice(randomIndex, 1);
  }
  return cards;
}
// 예상되는 결과: ['7H', '7D', '7S', '7C', '8H', '8D', '8S']

function PickOnecardFromList(cardlist: string[]): string {
  const randomIndex = Math.floor(Math.random() * cardlist.length);
  const card = cardlist[randomIndex];
  cardlist.splice(randomIndex, 1);
  return card;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function player1draw(
  player1Deck: string[],
  player2Deck: string[],
  centerDeck: string[],
  showDeck: string[],
  target: number
): string[][] {
  if (target > centerDeck.length) {
    let tmp: string[] = centerDeck;
    centerDeck = [];
    let newPlayer1Deck: string[] = [...player1Deck, ...tmp];
    let newPlayer2Deck: string[] = player2Deck;
    let newShowDeck: string[] = showDeck;
    let newCenterDeck: string[] = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  } else {
    let tmp: string[] = centerDeck.splice(0, target);
    let newPlayer1Deck: string[] = [...player1Deck, ...tmp];
    let newPlayer2Deck: string[] = player2Deck;
    let newShowDeck: string[] = showDeck;
    let newCenterDeck: string[] = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  }
}
function player2draw(
  player1Deck: string[],
  player2Deck: string[],
  centerDeck: string[],
  showDeck: string[],
  target: number
): string[][] {
  if (target > centerDeck.length) {
    let tmp: string[] = centerDeck;
    centerDeck = [];
    let newPlayer2Deck: string[] = [...player2Deck, ...tmp];
    let newPlayer1Deck: string[] = player1Deck;
    let newShowDeck: string[] = showDeck;
    let newCenterDeck: string[] = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  } else {
    let tmp: string[] = centerDeck.splice(0, target);
    let newPlayer2Deck: string[] = [...player2Deck, ...tmp];
    let newPlayer1Deck: string[] = player1Deck;
    let newShowDeck: string[] = showDeck;
    let newCenterDeck: string[] = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  }
}

function initailize_deck(): string[][] {
  // 덱 초기세팅
  let newCenterDeck: string[] = shuffleArray(Cardlist());
  let newPlayer1Deck: string[] = PickSevenCardsFromList(newCenterDeck);
  let newPlayer2Deck: string[] = PickSevenCardsFromList(newCenterDeck);
  let newShowDeck: string[] = [PickOnecardFromList(newCenterDeck)];
  shuffleArray(newCenterDeck);
  return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
}
function card_drop(
  content: string,
  player1Deck: string[],
  player2Deck: string[],
  centerDeck: string[],
  showDeck: string[],
  type: string
): string[][] {
  if (type === 'player1') {
    showDeck.push(content);
    player1Deck.splice(player1Deck.indexOf(content), 1);
    let newPlayer1Deck = player1Deck;
    let newPlayer2Deck = player2Deck;
    let newShowDeck = showDeck;
    let newCenterDeck = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  } else {
    showDeck.push(content);
    player2Deck.splice(player2Deck.indexOf(content), 1);
    let newPlayer1Deck = player1Deck;
    let newPlayer2Deck = player2Deck;
    let newShowDeck = showDeck;
    let newCenterDeck = centerDeck;
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  }
}

//여기서 judge_true 로직은 x.
export function SetandPlay(
  content: string,
  type: string,
  player1Deck: string[],
  player2Deck: string[],
  centerDeck: string[],
  showDeck: string[]
): string[][] {
  let newPlayer1Deck: string[] = [];
  let newPlayer2Deck: string[] = [];
  let newCenterDeck: string[] = [];
  let newShowDeck: string[] = [];

 
  // if (player1Deck.length > 9) {
  //   //! admin 이 승리
  //   newPlayer1Deck = ['0'];
  //   newPlayer2Deck = ['1'];
  //   newCenterDeck = [];
  //   newShowDeck = [];
  //   return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  // } else if (player2Deck.length > 21) {
  //   newPlayer1Deck = ['1'];
  //   newPlayer2Deck = ['0'];
  //   newCenterDeck = [];
  //   newShowDeck = [];
  //   return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  // }

  if (type === 'player1') {
    if (content === 'g') {
      // player1이 Get 버튼을 눌렀을 때 + 다 비어있을 때 초기 세팅
      if (
        player1Deck.length === 0 &&
        centerDeck.length === 0 &&
        showDeck.length === 0 &&
        player2Deck.length === 0
      ) {
        [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck] =
          initailize_deck();
      } // player1이 Get 버튼을 눌렀을 때 + 다 비어있지 않을 때 -> 뽑는다
      else {
        let number: number = 0;
        if (showDeck[showDeck.length - 1][0] === 'A') number = 5;
        else if (showDeck[showDeck.length - 1][0] === '2')
          number = 2; // CenterDeck에 있는 카드를 2장 가져옴
        else number = 1; // CenterDeck에 있는 카드를 1장 가져옴
        [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck] =
          player1draw(player1Deck, player2Deck, centerDeck, showDeck, number);
      }
    } //content is not g -> drop card
    else {
      [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck] = card_drop(
        content,
        player1Deck,
        player2Deck,
        centerDeck,
        showDeck,
        type
      );
    }
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  } else {
    if (content === 'g') {
      let number: number = 0;
      if (showDeck[showDeck.length - 1][0] === 'A') number = 5;
      else if (showDeck[showDeck.length - 1][0] === '2')
        number = 2; // CenterDeck에 있는 카드를 2장 가져옴
      else number = 1; // CenterDeck에 있는 카드를 1장 가져옴
      [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck] =
        player2draw(player1Deck, player2Deck, centerDeck, showDeck, number);
    } else {
      [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck] = card_drop(
        content,
        player1Deck,
        player2Deck,
        centerDeck,
        showDeck,
        type
      );
    }
    return [newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck];
  }
}

export function judgeTrue(showcard: string[], myDeck: string[]): string[] {
  //showcard = [3S, 4C, 5C, 5D, ]:
  //myDeck = [3C, 4H]
  let result: string[] = [];
  for (let i = 0; i < myDeck.length; i++) {
    if (showcard[showcard.length - 1][0] === myDeck[i][0]) {
      result.push(myDeck[i]);
    } else if (
      showcard[showcard.length - 1][
        showcard[showcard.length - 1].length - 1
      ] === myDeck[i][myDeck[i].length - 1]
    ) {
      result.push(myDeck[i]);
    }
  }
  return result;
}
