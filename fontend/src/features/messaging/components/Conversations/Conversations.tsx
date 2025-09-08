import { request } from "../../../../utils/api";
import { useAuthentication, type IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import type { IMessage } from "../Messages/Messages";
import { Conversation } from "./components/Conversation/Conversation";
import classes from "./Conversations.module.scss";
import { useEffect, useState, type HTMLAttributes } from "react";


export interface IConversation {
    id: number;
    author: IUser;
    recipient: IUser;
    messages: IMessage[];
}

interface IConversationsProps extends HTMLAttributes<HTMLDivElement> { }

export function Conversations(props: IConversationsProps) {

    const [conversations, setConversations] = useState<IConversation[]>([]);
    const { user } = useAuthentication();
    const websocketClient = useWebSocket();

    useEffect(() => {
        request<IConversation[]>({
            endpoint: "/api/v1/messaging/conversations",
            onSuccess: (data) => setConversations(data),
            onFailure: (error) => console.log(error),
        });
    }, []);

    useEffect(() => {
        const subscription = websocketClient?.subscribe(
            `/topic/users/${user?.id}/conversations`,
            (message) => {
                const conversation = JSON.parse(message.body);
                setConversations((prevConversations) => {
                    const index = prevConversations.findIndex((c) => c.id === conversation.id);
                    if (index === -1) {
                        return [conversation, ...prevConversations];
                    }
                    return prevConversations.map((c) => (c.id === conversation.id ? conversation : c));
                });
            });
        return () => subscription?.unsubscribe();
    }, [user?.id, websocketClient]);

    return (
        <div className={classes.root} {...props}>
            {conversations.map((conversation) => {
                return <Conversation key={conversation.id} conversation={conversation} />;
            })}

            {conversations.length === 0 && (
                <div
                    className={classes.welcome}
                    style={{ padding: "1rem", }}
                >
                    No conversations to display.
                </div>
            )}
        </div>
    );
}