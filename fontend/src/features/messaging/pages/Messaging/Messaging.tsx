import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classes from "./Messaging.module.scss";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { RightSidebar } from "../../../feed/components/RightSidebar/RightSidebar";
import { Conversations } from "../../components/Conversations/Conversations";
import { useEffect, useState } from "react";

export function Messaging() {
    usePageTitle("Messaging");
    const navigate = useNavigate();
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onConversation = location.pathname.includes("conversations");
    const creatingNewConversation = location.pathname.includes("new");

    useEffect(() => {
        const handleSize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleSize);
        return () => window.removeEventListener("resize", handleSize);
    }, []);


    return (
        <div className={classes.root}>
            <div className={classes.messaging}>
                <div
                    className={classes.sidebar}
                    style={{
                        display: windowWidth >= 1024 || !creatingNewConversation ? "block" : "none",
                    }}
                >
                    <div className={classes.header}>
                        <h1>Messaging</h1>
                        <button
                            onClick={() => {
                                navigate("conversations/new")
                            }}
                            className={classes.new}
                        >
                            +
                        </button>
                    </div>
                    <Conversations
                        style={{
                            display: onConversation && windowWidth < 1024 ? "none" : "block",
                        }}
                    />
                </div>
                <Outlet />
            </div>
            <div className={classes.adds}>
                <RightSidebar />
            </div>
        </div>
    );
}