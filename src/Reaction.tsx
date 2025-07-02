import { useState } from "react";
import { Link } from "react-router";
import { type reaction } from "./types";
import { useParams } from "react-router";
import { postReaction } from "./requests";



function Reaction({
    reactions,
    deviceId,
    loadReactions,
}: {
    reactions: reaction[];
    deviceId: string;
    loadReactions: () => void;
}) {
    const { reaction } = useParams();
    const [newNote, setNewNote] = useState("");

    const reactionList = reactions.filter((item) => item.emoji === reaction).reverse();

    async function addReaction() {
        if (reaction && newNote !== "") {
            setNewNote("");
            await postReaction({
                emoji: reaction,
                note: newNote,
                deviceId,
            });
            await loadReactions();
        }
    }

    return (
        <div>
            <Link to="/">back</Link>
            <h1>
                {reaction} {reactionList.length}
            </h1>
            {reactionList
                .filter((reaction) => reaction.note !== "")
                .map((reaction) => (
                    <p>{reaction.note}</p>
                ))}
            <input
                type="text"
                placeholder="new note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
            ></input>
            <button disabled={newNote === ""} onClick={addReaction}>
                add
            </button>
        </div>
    );
}

export default Reaction;
