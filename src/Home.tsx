import "./App.css";
import { useState } from "react";
import type { reaction, reactionSummary } from "./types";
import { postReaction } from "./requests";
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
                <h2 className="link-emoji">{emoji}</h2>
                <p className="link-count">{count}</p>
            </div>
        </Link>
    );
}

function Home({
    reactions,
    deviceId,
    loadReactions,
}: {
    reactions: reaction[];
    deviceId: string;
    loadReactions: () => void;
}) {
    const [newVisible, setNewVisible] = useState(false);

    const reactionSummaries: reactionSummary[] = [];

    reactions.forEach((reaction: reaction) => {
        const emojiIndex = reactionSummaries.findIndex((summary) => summary.emoji === reaction.emoji);
        if (emojiIndex >= 0) {
            reactionSummaries[emojiIndex].count++;
        } else {
            reactionSummaries.push({
                emoji: reaction.emoji,
                count: 1,
            });
        }
    });
    reactionSummaries.sort((a, b) => b.count - a.count);

    return (
        <>
            <h1>Coop Tech Check</h1>
            <div id="reaction-links-container">
                {reactionSummaries.map((reaction) => (
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
                <button className="plus-button" onClick={() => setNewVisible(true)}>
                    +
                </button>
            )}
            <p>
                TODO: the emojis will get bigger or smaller based on the number of reactions and arranged to fit
                together. They will update live as they're posted without refresh needed. People will be able to post
                any emoji not just the default ones
            </p>
        </>
    );
}

export default Home;
