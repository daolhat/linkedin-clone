import { useEffect, useState, type FormEvent } from "react";
import type { IConversation } from "../../components/Conversations/Conversations";
import classes from "./Conversation.module.scss";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthentication, type IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { request } from "../../../../utils/api";
import { Input } from "../../../../components/Input/Input";
import { Messages } from "../../components/Messages/Messages";

export function Conversation() {

    const [postingMessage, setPostingMessage] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [suggestingUsers, setSuggestingUsers] = useState<IUser[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [conversation, setConversation] = useState<IConversation | null>(null);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const websocketClient = useWebSocket();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthentication();
    const creatingNewConversation = id === "new";

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
                console.log(conversation);
                setConversations((prevConversations) => {
                    const index = prevConversations.findIndex((c) => c.id === conversation.id);
                    if (index === -1) {
                        return [conversation, ...prevConversations];
                    }
                    return prevConversations.map((c) => c.id === conversation.id ? conversation : c);
                });
            }
        );
        return () => subscription?.unsubscribe();
    }, [user?.id, websocketClient]);

    useEffect(() => {
        if (id == "new") {
            setConversation(null);
            request<IUser[]>({
                endpoint: "/api/v1/authentication/users",
                onSuccess: (data) => setSuggestingUsers(data),
                onFailure: (error) => console.log(error),
            });
        } else {
            request<IConversation>({
                endpoint: `/api/v1/messaging/conversations/${id}`,
                onSuccess: (data) => setConversation(data),
                onFailure: () => navigate("/messaging"),
            });
        }
    }, [id, navigate]);

    useEffect(() => {
        const subscription = websocketClient?.subscribe(
            `/topic/conversations/${conversation?.id}/messages`,
            (data) => {
                const message = JSON.parse(data.body);
                setConversation((prevConversation) => {
                    if (!prevConversation) return null;
                    const index = prevConversation.messages.findIndex((m) => m.id === message.id);
                    if (index === -1) {
                        return {
                            ...prevConversation,
                            messages: [...prevConversation.messages, message],
                        };
                    }
                    return {
                        ...prevConversation,
                        messages: prevConversation?.messages.map((m) => (m.id === message.id ? message : m)),
                    };
                });
            }
        );
        return () => subscription?.unsubscribe();
    }, [conversation?.id, websocketClient]);

    async function addMessageToConversation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPostingMessage(true);
        await request<void>({
            endpoint: `/api/v1/messaging/conversations/${conversation?.id}/messages`,
            method: "POST",
            body: JSON.stringify({
                receiverId:
                    conversation?.recipient.id === user?.id
                        ? conversation?.author.id
                        : conversation?.recipient.id,
                content,
            }),
            onSuccess: () => {},
            onFailure: (error) => console.log(error),
        });
        setPostingMessage(false);
    }

    async function createConversationWithMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const message = {
            receiverId: selectedUser?.id,
            content,
        };
        console.log(message);
        await request<IConversation>({
            endpoint: "/api/v1/messaging/conversations",
            method: "POST",
            body: JSON.stringify(message),
            onSuccess: (conversation) => navigate(`/messaging/conversations/${conversation.id}`),
            onFailure: (error) => console.log(error),
        });
    }

    const conversationUserToDisplay = conversation?.recipient.id === user?.id ? conversation?.author : conversation?.recipient;

    return (
        <div className={`${classes.root} ${creatingNewConversation ? classes.new : ""}`}>
            {(conversation || creatingNewConversation) && (
                <>
                    <div className={classes.header}>
                        <button className={classes.back} onClick={() => navigate("/messaging")}>
                            {"<"}
                        </button>
                    </div>
                    {conversation && (
                        <div className={classes.top}>
                            <img
                                className={classes.avatar}
                                src={conversationUserToDisplay?.profilePicture}
                                alt=""
                            />
                            <div>
                                <div className={classes.name}>
                                    {conversationUserToDisplay?.firstName} {conversationUserToDisplay?.lastName}
                                </div>
                                <div className={classes.title}>
                                    {conversationUserToDisplay?.position} at {conversationUserToDisplay?.company}
                                </div>
                            </div>
                        </div>
                    )}
                    {creatingNewConversation && (
                        <form className={`${classes.form} ${classes.new}`} onSubmit={(e) => e.preventDefault()}>
                            <p style={{ marginTop: "1rem" }}>
                                Starting a new conversation {selectedUser && "with:"}
                            </p>
                            {!selectedUser && (
                                <Input
                                    type="text"
                                    name="recipient"
                                    placeholder="Type a name"
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            )}
                            {selectedUser && (
                                <div className={classes.top}>
                                    <img className={classes.avatar} src={selectedUser.profilePicture || "/avatar.png"} alt="" />
                                    <div>
                                        <div className={classes.name}>
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </div>
                                        <div className={classes.title}>
                                            {selectedUser.position} at {selectedUser.company}
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className={classes.close}>
                                        X
                                    </button>
                                </div>
                            )}

                            {!selectedUser && !conversation && (
                                <div className={classes.suggestions}>
                                    {suggestingUsers
                                        .filter((user) => user.firstName?.includes(search) || user.lastName?.includes(search))
                                        .map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => {
                                                    const conversation = conversations.find((c) => c.recipient.id === user.id || c.author.id === user.id);
                                                    if (conversation) {
                                                        navigate(`/messaging/conversations/${conversation.id}`);
                                                    } else {
                                                        setSelectedUser(user);
                                                    }
                                                }}
                                            >
                                                <img className={classes.avatar} src={user.profilePicture || "/avatar.png"} alt="" />
                                                <div>
                                                    <div className={classes.name}>
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className={classes.title}>
                                                        {user.position} at {user.company}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </form>
                    )}

                    {conversation && <Messages messages={conversation.messages} user={user} />}

                    <form
                        className={classes.form}
                        onSubmit={async (e) => {
                            if (!content) return;
                            if (conversation) {
                                await addMessageToConversation(e);
                            } else {
                                await createConversationWithMessage(e);
                            }
                            setContent("");
                            setSelectedUser(null);
                        }}
                    >
                        <input
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            name="content"
                            className={classes.textarea}
                            placeholder="Write a message..."
                        />
                        <button
                            type="submit"
                            className={classes.send}
                            disabled={postingMessage || !content.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                            </svg>
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
