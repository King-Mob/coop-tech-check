import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { reaction, reactionSummary } from "./types";
import { getReactions, postReaction } from "./requests";
import { Link } from "react-router";

const possibleEmojis = ["❤️", "💡", "👍", "😮"];

function NewReaction({ deviceId, close }: { deviceId: string; close: () => void }) {
    const [emoji, setEmoji] = useState("❤️");
    const [note, setNote] = useState("");

    async function addReaction() {
        await postReaction({
            emoji,
            note,
            deviceId,
        });
        close();
    }

    return (
        <div>
            {possibleEmojis.map((possible) => (
                <button className={possible === emoji ? "emoji-selected" : ""} onClick={() => setEmoji(possible)}>
                    {[possible]}
                </button>
            ))}
            <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="optional note"
            ></input>
            <button onClick={addReaction}>add</button>
            <button onClick={close}>close</button>
        </div>
    );
}

function ReactionLink({ emoji, count }: { emoji: string; count: number }) {
    return (
        <Link to={`/reactions/${emoji}`}>
            <div className="reaction-link">
                <h2>{emoji}</h2>
                <p>{count}</p>
            </div>
        </Link>
    );
}

function App() {
    const [reactions, setReactions] = useState<reactionSummary[]>([]);
    const [deviceId, setDeviceId] = useState<string>();
    const [newVisible, setNewVisible] = useState(false);

    async function loadReactions() {
        const reactionList = await getReactions();

        const result: reactionSummary[] = [];
        reactionList.forEach((reaction: reaction) => {
            const emojiIndex = result.findIndex((summary) => summary.emoji === reaction.emoji);
            if (emojiIndex >= 0) {
                result[emojiIndex].count++;
            } else {
                result.push({
                    emoji: reaction.emoji,
                    count: 1,
                });
            }
        });
        result.sort((a, b) => b.count - a.count);

        setReactions(result);
    }

    function loadDeviceId() {
        const existingId = localStorage.getItem("coopTechCheckDeviceId");
        if (existingId) {
            setDeviceId(existingId);
        } else {
            const newId = uuidv4();
            setDeviceId(newId);
            localStorage.setItem("coopTechCheckDeviceId", newId);
        }
    }

    useEffect(() => {
        loadReactions();
        loadDeviceId();
    }, []);

    return (
        <>
            <h1>Coop Tech Check</h1>
            <p>
                TODO: the emojis will get bigger or smaller based on the number of reactions and arranged to fit
                together. They will update live as they're posted without refresh needed. People will be able to post
                any emoji not just the default ones
            </p>
            <div id="reaction-links-container">
                {reactions.map((reaction) => (
                    <ReactionLink emoji={reaction.emoji} count={reaction.count} />
                ))}
            </div>
            {deviceId && newVisible ? (
                <NewReaction
                    deviceId={deviceId}
                    close={() => {
                        setNewVisible(false);
                        loadReactions();
                    }}
                />
            ) : (
                <button onClick={() => setNewVisible(true)}>+</button>
            )}
        </>
    );
}

export default App;
