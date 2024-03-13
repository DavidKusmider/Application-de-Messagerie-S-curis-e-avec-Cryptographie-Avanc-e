export type User = {id: string, name: string, image: string | undefined, email: string, createdAt: Date};
export type Message = {id: number, createdAt: Date, image: string | undefined, content: string};
export type Conversation = {id: string, name: string};
export type Notification = {id: string, msg: string};
export type Group = {id: string, name: string};

export type FullMessageType = Message & {
    sender: User,
    seen: User[]
  };
  
  export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[]
  };
