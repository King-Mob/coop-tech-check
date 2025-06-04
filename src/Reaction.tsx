import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router";
import { type reaction } from "./types";
import { useParams } from "react-router";
import { getReactions, postReaction } from "./requests";

function Reaction({}) {
    const { reaction } = useParams();
    const [reactions, setReactions] = useState<reaction[]>([]);
    const [newNote, setNewNote] = useState("");
    const [deviceId, setDeviceId] = useState("");

    async function loadReactions() {
        const reactionList: reaction[] = await getReactions();
        setReactions(reactionList.filter((item) => item.emoji === reaction).reverse());
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
                {reaction} {reactions.length}
            </h1>
            {reactions
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
