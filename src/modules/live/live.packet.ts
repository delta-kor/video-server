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
  export interface Hello extends ClientPacketBase<'hello'> {
    ticket: string;
    token: string | null;
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

  export interface MultipleDevice extends ServerPacketBase<'multiple-device'> {}
}

export { ClientPacketBase, ServerPacketBase, ClientPacket, ServerPacket };
