import { NextApiRequest } from 'next';

import { NextApiResponseServerIo } from '@/types';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { SetandPlay } from '@/lib/gameMachine';
import { GameStatus } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl, type, serverId } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // player1(도전자) 가 start 버튼을 누르면 content 에 'g' 가 가고

    const player1Deck =
      conversation.player1Deck === ''
        ? conversation.player1Deck
        : conversation.player1Deck.split(',');
    const player2Deck =
      conversation.player2Deck === ''
        ? conversation.player2Deck
        : conversation.player2Deck.split(',');
    const centerDeck =
      conversation.centerDeck === ''
        ? conversation.centerDeck
        : conversation.centerDeck.split(',');
    const showDeck =
      conversation.showDeck === ''
        ? conversation.showDeck
        : conversation.showDeck.split(',');

    // content => 입력값(낸 카드(4H, AC...) 또는 Get 버튼('g'))
    // type => player1 가 보낸 건지 player2가 보낸 건지
    // ! 참고: player1 이 도전자, player2 가 서버 주인

    const setDeck = SetandPlay(
      content,
      type,
      Array.from(player1Deck),
      Array.from(player2Deck),
      Array.from(centerDeck),
      Array.from(showDeck)
    );

    console.log('setDeck[0].length', setDeck[0].length);

    if (setDeck[0].length === 0) {
      await db.oneCardRoom.updateMany({
        where: {
          status: GameStatus.RUN,
          deck1: serverId,
        },
        data: {
          winner: conversation.memberOne.profileId,
          status: GameStatus.END,
        },
      });

      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          memberId: member.id,
          player1Deck: '1',
          player2Deck: '0',
          centerDeck: 'end',
          showDeck: 'end',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberTwo.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          loseCount: {
            increment: 1,
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberOne.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          winCount: {
            increment: 1,
          },
        },
      });

      const channelKey = `chat:${conversationId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    } else if (setDeck[1].length === 0) {
      await db.oneCardRoom.updateMany({
        where: {
          status: GameStatus.RUN,
          deck1: serverId,
        },
        data: {
          winner: conversation.memberTwo.profileId,
          status: GameStatus.END,
        },
      });

      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          memberId: member.id,
          player1Deck: '0',
          player2Deck: '1',
          centerDeck: 'end',
          showDeck: 'end',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberOne.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          loseCount: {
            increment: 1,
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberTwo.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          winCount: {
            increment: 1,
          },
        },
      });

      const channelKey = `chat:${conversationId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    }

    // TODO: 이 부분 ADMIN 이 아닌 GUEST를 지워야 한다.
    // TODO: 그리고 Defi를 결과에 따라 처리한다. api 필요
    // TODO: 센터댁이 없을 때 남은 카드 숫자 비교
    // TODO: 나의 덱에 한장도 없을 떄 내가 이긴게 된다. 추가하기
    if (setDeck[2].length === 0 || setDeck[0].length > 21) {
      if (
        setDeck[2].length === 0 &&
        setDeck[0].length <= 21 &&
        setDeck[1].length <= 21
      ) {
        if (setDeck[0].length > setDeck[1].length) {
          //! ADMIN의 승리
          await db.oneCardRoom.updateMany({
            where: {
              status: GameStatus.RUN,
              deck1: serverId,
            },
            data: {
              winner: conversation.memberTwo.profileId,
              status: GameStatus.END,
            },
          });

          const message = await db.directMessage.create({
            data: {
              content,
              fileUrl,
              conversationId: conversationId as string,
              memberId: member.id,
              player1Deck: '0',
              player2Deck: '1',
              centerDeck: 'end',
              showDeck: 'end',
            },
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberOne.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
              loseCount: {
                increment: 1,
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberTwo.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
              winCount: {
                increment: 1,
              },
            },
          });

          const channelKey = `chat:${conversationId}:messages`;

          res?.socket?.server?.io?.emit(channelKey, message);

          return res.status(200).json(message);
        } else if (setDeck[0].length < setDeck[1].length) {
          await db.oneCardRoom.updateMany({
            where: {
              status: GameStatus.RUN,
              deck1: serverId,
            },
            data: {
              winner: conversation.memberOne.profileId,
              status: GameStatus.END,
            },
          });

          const message = await db.directMessage.create({
            data: {
              content,
              fileUrl,
              conversationId: conversationId as string,
              memberId: member.id,
              player1Deck: '1',
              player2Deck: '0',
              centerDeck: 'end',
              showDeck: 'end',
            },
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberTwo.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
              loseCount: {
                increment: 1,
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberOne.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
              winCount: {
                increment: 1,
              },
            },
          });

          const channelKey = `chat:${conversationId}:messages`;

          res?.socket?.server?.io?.emit(channelKey, message);

          return res.status(200).json(message);
        } else if (setDeck[0].length === setDeck[1].length) {
          await db.oneCardRoom.updateMany({
            where: {
              status: GameStatus.RUN,
              deck1: serverId,
            },
            data: {
              winner: 'DRAW',
              status: GameStatus.END,
            },
          });

          const message = await db.directMessage.create({
            data: {
              content,
              fileUrl,
              conversationId: conversationId as string,
              memberId: member.id,
              player1Deck: '3',
              player2Deck: '3',
              centerDeck: 'end',
              showDeck: 'end',
            },
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberOne.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
            },
          });

          await db.server.update({
            where: {
              id: conversation.memberTwo.serverId,
            },
            data: {
              members: {
                deleteMany: {
                  role: 'GUEST',
                },
              },
            },
          });

          const channelKey = `chat:${conversationId}:messages`;

          res?.socket?.server?.io?.emit(channelKey, message);

          return res.status(200).json(message);
        }
      }

      //! admin의 승리 = memberTwo

      await db.oneCardRoom.updateMany({
        where: {
          status: GameStatus.RUN,
          deck1: serverId,
        },
        data: {
          winner: conversation.memberTwo.profileId,
          status: GameStatus.END,
        },
      });

      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          memberId: member.id,
          player1Deck: '0',
          player2Deck: '1',
          centerDeck: 'end',
          showDeck: 'end',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberOne.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          loseCount: {
            increment: 1,
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberTwo.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          winCount: {
            increment: 1,
          },
        },
      });

      const channelKey = `chat:${conversationId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    } else if (setDeck[1].length > 21) {
      //! Guest의 승리 = memberOne

      await db.oneCardRoom.updateMany({
        where: {
          status: GameStatus.RUN,
          deck1: serverId,
        },
        data: {
          winner: conversation.memberOne.profileId,
          status: GameStatus.END,
        },
      });

      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          memberId: member.id,
          player1Deck: '1',
          player2Deck: '0',
          centerDeck: 'end',
          showDeck: 'end',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberTwo.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          loseCount: {
            increment: 1,
          },
        },
      });

      await db.server.update({
        where: {
          id: conversation.memberOne.serverId,
        },
        data: {
          members: {
            deleteMany: {
              role: 'GUEST',
            },
          },
          winCount: {
            increment: 1,
          },
        },
      });

      const channelKey = `chat:${conversationId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    }
    // function ( content, type, player1Deck, player2Deck, centerDeck, showDeck )

    // const result = function setDeck( content, type, player1Deck, player2Deck, centerDeck, showDeck )

    // const {newPlayer1Deck, newPlayer2Deck, newCenterDeck, newShowDeck} = result

    console.log('setDeck', setDeck);

    // return:
    const newPlayer1Deck = setDeck[0];
    const newPlayer2Deck = setDeck[1];
    const newCenterDeck = setDeck[2];
    const newShowDeck = setDeck[3];

    await db.conversation.update({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      data: {
        player1Deck: newPlayer1Deck.join(','),
        player2Deck: newPlayer2Deck.join(','),
        centerDeck: newCenterDeck.join(','),
        showDeck: newShowDeck.join(','),
      },
    });

    // TODO: 문제 생기면 이 부분이 문제
    // player1Deck: newPlayer1Deck.join(','),
    //     player2Deck: newPlayer2Deck.join(','),
    //     centerDeck: newCenterDeck.join(','),
    //     showDeck: newShowDeck.join(','),
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
        player1Deck: newPlayer1Deck.join(','),
        player2Deck: newPlayer2Deck.join(','),
        centerDeck: newCenterDeck.join(','),
        showDeck: newShowDeck.join(','),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
