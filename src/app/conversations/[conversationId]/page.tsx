import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const user1 = {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())};
  const messages = [{id: '0', createdAt: new Date(Date.now()), image: undefined, body: 'Ceci est un message', sender: user1, seen: []}];//await getMessages(params.conversationId);
  const conversation = {id: '0', name:'Test', users : [user1], messages: messages};//await getConversationById(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages}/>
        <Form />
      </div>
    </div>
  );
}

export default ChatId;