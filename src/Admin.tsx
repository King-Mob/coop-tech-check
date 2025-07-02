import { useState } from "react";
import { useNavigate } from "react-router";

const { VITE_ADMIN_CODE } = import.meta.env;

function Admin() {
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState("true" === localStorage.getItem("coop.tech.check.admin"));
    const navigate = useNavigate();

    function enter() {
        if (code === VITE_ADMIN_CODE) {
            localStorage.setItem("coop.tech.check.admin", "true");
            setCode("");
            setSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 500);
        }
    }

    return (
        <div>
            {success ? (
                <h3>Admin mode enabled</h3>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="admin code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    ></input>
                    <button onClick={enter} disabled={code.length < 1}>
                        Enter code
                    </button>
                </>
            )}
        </div>
    );
}

export default Admin;
