import "./App.css";
import { useState } from "react";
import type { message, reaction } from "./types";
import { postMessage, putMessage, redactEvent } from "./requests";

const possibleEmojis = ["❤️", "💡", "👍", "😀"];
const moreEmojis = ["🚀", "🔥", "🐙", "🤠"];

function Reaction({ reactions }: { reactions: reaction[] }) {
    const [moreVisible, setMoreVisible] = useState(false);

    /*
    function createReaction() {}

    function removeReaction() {}
    */

    return (
        <div className="reactions-container">
            {possibleEmojis.map((emoji) => {
                const emojiCount = reactions.filter((reaction) => reaction.emoji === emoji).length;
                return (
                    <>
                        <button>{emoji}</button>
                        <span className="reaction-count">{emojiCount > 0 ? emojiCount : ""}</span>
                    </>
                );
            })}
            {moreVisible ? (
                <div className="more-container">
                    <button onClick={() => setMoreVisible(false)}>x</button>
                    {moreEmojis.map((emoji) => (
                        <button>{emoji}</button>
                    ))}
                </div>
            ) : (
                <button onClick={() => setMoreVisible(true)}>+</button>
            )}
        </div>
    );
}

function Message({ message, admin, loadMessages }: { message: message; admin: boolean; loadMessages: () => void }) {
    const [messageText, setMessageText] = useState(message.text);

    async function updateMessage() {
        await putMessage(messageText, message.event_id);
        loadMessages();
    }

    async function removeMessage() {
        await redactEvent(message.event_id, "deleted by admin");
        loadMessages();
    }

    return (
        <div>
            {admin ? (
                <>
                    <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}></input>
                    <button onClick={updateMessage}>Save</button>
                    <button onClick={removeMessage}>Delete</button>
                </>
            ) : (
                <p>{message.text}</p>
            )}
            <Reaction reactions={message.reactions} />
        </div>
    );
}

function Home({
    messages,
    // deviceId,
    loadMessages,
}: {
    messages: message[];
    deviceId: string;
    loadMessages: () => void;
}) {
    const [newPrompt, setNewPrompt] = useState("");
    const admin = localStorage.getItem("coop.tech.check.admin") === "true";

    async function createPrompt() {
        await postMessage(newPrompt);
        setNewPrompt("");
        loadMessages();
    }

    return (
        <div>
            <h1>Coop Tech Check</h1>
            {messages.map((message) => (
                <Message message={message} admin={admin} loadMessages={loadMessages} />
            ))}
            {admin && (
                <>
                    <input
                        type="text"
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        placeholder="New prompt"
                    ></input>
                    <button onClick={createPrompt}>Add new prompt</button>
                </>
            )}
        </div>
    );
}

export default Home;
