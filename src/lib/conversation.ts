import { db } from '@/lib/db';



// TODO: 현재 들어온 member role를 확인하고 배정한다. 도전자(GUEST)가 memberOneId 이다. 
export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ;

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {


  const player1Deck = '';
  const player2Deck = '';
  const centerDeck = '';
  const showDeck = '';

  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
        player1Deck,
        player2Deck,
        centerDeck,
        showDeck,
        player1Turn: true,
        player2Turn: false,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
