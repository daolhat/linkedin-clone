import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button.tsx";
import { usePageTitle } from "../../../../hooks/usePageTitle.tsx";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider.tsx";
import { LeftSidebar } from "../../components/LeftSidebar/LeftSidebar.tsx";
import { Modal } from "../../components/Modal/Modal.tsx";
import { Post, type IPost } from "../../components/Post/Post.tsx";
import { RightSidebar } from "../../components/RightSidebar/RightSidebar.tsx";
import classes from "./Feed.module.scss";
import { request } from "../../../../utils/api.ts";

export function Feed() {
    usePageTitle("Feed");
    const [showPostingModal, setShowPostingModal] = useState(false);
    const [feedContent, setFeedContent] = useState<"all" | "connexions">("connexions");
    const { user } = useAuthentication();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            await request<IPost[]>({
                endpoint: "/api/v1/feed" + (feedContent === "connexions" ? "" : "/posts"),
                onSuccess: (data) => setPosts(data),
                onFailure: (error) => setError(error),
            });
        };
        fetchPosts();
    }, [feedContent]);

    const handlePost = async (content: string, picture: string) => {
        await request<IPost>({
            endpoint: "/api/v1/feed/posts",
            method: "POST",
            body: JSON.stringify({ content, picture }),
            onSuccess: (data) => setPosts([data, ...posts]),
            onFailure: (error) => setError(error),
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <LeftSidebar />
            </div>
            <div className={classes.center}>
                <div className={classes.posting}>
                    <button
                        onClick={() => {
                            navigate(`/profile/${user?.id}`);
                        }}
                    >
                        <img
                            className={`${classes.top} ${classes.avatar}`}
                            src={user?.profilePicture || "/avatar.png"}
                            alt=""
                        />
                    </button>
                    <Button outline onClick={() => setShowPostingModal(true)}>
                        Start a post
                    </Button>
                    <Modal
                        title="Creating a post"
                        onSubmit={handlePost}
                        showModal={showPostingModal}
                        setShowModal={setShowPostingModal}
                    />
                </div>
                {error && <div className={classes.error}>{error}</div>}

                <div className={classes.header}>
                    <button
                        className={feedContent === "all" ? classes.active : ""}
                        onClick={() => setFeedContent("all")}
                    >
                        All
                    </button>
                    <button
                        className={feedContent === "connexions" ? classes.active : ""}
                        onClick={() => setFeedContent("connexions")}
                    >
                        Feed
                    </button>
                </div>

                <div className={classes.feed}>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} setPosts={setPosts} />
                    ))}
                </div>
            </div>
            <div className={classes.right}>
                <RightSidebar />
            </div>
        </div>
    );
}
