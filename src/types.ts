import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server, Member, Profile, OneCardRoom } from '@prisma/client';


declare global {
  interface Window {
    ethereum: any;
  }
}


export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type SetOneCardRoom = {
  room: OneCardRoom;
};

export type SetServer = {
  server: Server;
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type GameType = {
  ONE: 'ONE';
  SEVEN: 'AUDIO';
  VIDEO: 'VIDEO';
};
