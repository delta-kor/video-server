import { ChatContent, ChatInfo } from './interface/chat.interface';
import { MediaInfo } from './interface/cinema.interface';
import { UserInfo } from './interface/user.interface';

interface PacketBase<T extends string = any> {
  type: T;
}

interface ClientPacketBase<T extends string = any> extends PacketBase<T> {
  packet_id: number;
}

interface ServerPacketBase<T extends string = any> extends PacketBase<T> {
  packet_id: number | null;
}

namespace ClientPacket {
  export namespace Manage {
    export interface AddMedia extends ClientPacketBase<'add-media'> {
      media: MediaInfo;
    }
  }

  export interface Hello extends ClientPacketBase<'hello'> {
    ticket: string;
    token: string | null;
  }

  export interface UserSync extends ClientPacketBase<'user-sync'> {
    id: string[];
  }

  export interface ChatMessage extends ClientPacketBase<'chat-message'> {
    content: ChatContent;
  }

  export interface ChatSync extends ClientPacketBase<'chat-sync'> {
    point: string | null;
  }
}

namespace ServerPacket {
  export interface Hello extends ServerPacketBase<'hello'> {
    server_time: number;
    user_info: UserInfo;
    token: string;
  }

  export interface Error extends ServerPacketBase<'error'> {
    message: string;
  }

  export interface MultipleConnect extends ServerPacketBase<'multiple-connect'> {}

  export interface UserConnect extends ServerPacketBase<'user-connect'> {
    user_info: UserInfo;
  }

  export interface UserDisconnect extends ServerPacketBase<'user-disconnect'> {
    id: string;
  }

  export interface LiveUserSync extends ServerPacketBase<'live-user-sync'> {
    data: UserInfo[];
  }

  export interface UserSync extends ServerPacketBase<'user-sync'> {
    data: UserInfo[];
  }

  export interface ChatMessage extends ServerPacketBase<'chat-message'> {
    chat_info: ChatInfo;
  }

  export interface ChatSync extends ServerPacketBase<'chat-sync'> {
    data: ChatInfo[];
    last: boolean;
  }
}

export { ClientPacketBase, ServerPacketBase, ClientPacket, ServerPacket };
