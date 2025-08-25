import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import classes from "./Profile.module.scss";
import { useAuthentication } from "../../../../features/authentication/contexts/AuthenticationContextProvider";
import { Button } from "../../../Button/Button";
import { Link, useNavigate } from "react-router-dom";


interface ProfileProps {
    setShowProfileMenu: Dispatch<SetStateAction<boolean>>;
    setShowNavigationMenu: Dispatch<SetStateAction<boolean>>;
    showProfileMenu: boolean;
}

export function Profile({
    showProfileMenu,
    setShowProfileMenu,
    setShowNavigationMenu,
}: ProfileProps) {

    const { logout, user } = useAuthentication();

    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [setShowProfileMenu]);

    return (
        <div className={classes.root} ref={ref}>
            <button
                className={classes.toggle}
                onClick={() => {
                    setShowProfileMenu((prev) => !prev);
                    if (window.innerWidth <= 1080) {
                        setShowNavigationMenu(false);
                    }
                }}
            >
                <img
                    className={`${classes.top} ${classes.avatar}`}
                    src={user?.profilePicture || "/avatar.png"}
                    alt=""
                />
                <div className={classes.name}>
                    <div>{user?.firstName + " " + user?.lastName?.charAt(0) + "."}</div>
                </div>
            </button>

            {showProfileMenu ? (
                <div className={classes.menu}>
                    <div className={classes.content}>
                        <img
                            className={`${classes.left} ${classes.avatar}`}
                            src={user?.profilePicture || "/avatar.png"}
                            alt=""
                        />
                        <div className={classes.right}>
                            <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
                            <div className={classes.title}>{user?.position + " at " + user?.company}</div>
                        </div>
                    </div>
                    <div className={classes.links}>
                        <Button
                            className={classes.button}
                            size="small"
                            outline
                            onClick={() => {
                                setShowProfileMenu(false);
                                navigate("/profile/" + user?.id)
                            }}
                        >
                            View profile
                        </Button>
                        <Link to="/settings" onClick={() => setShowProfileMenu(false)}>Settings & Privacy</Link>
                        <Link
                            to="/logout"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
}