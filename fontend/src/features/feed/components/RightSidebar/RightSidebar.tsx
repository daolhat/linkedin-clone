import { Button } from "../../../../components/Button/Button";
import classes from "./RightSidebar.module.scss";

export function RightSidebar() {
    return (<div className={classes.root}>
        <h3>Add to your feed</h3>
        <div className={classes.items}>
            <div className={classes.item}>
                <img
                    src="https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"
                    alt=""
                    className={classes.avatar}
                />
                <div className={classes.content}>
                    <div className={classes.name}>nhat</div>
                    <div className={classes.title}>hr at company</div>
                    <Button size="medium" outline className={classes.button}>
                        + Follow
                    </Button>
                </div>
            </div>
            <div className={classes.item}>
                <img
                    src="https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"
                    alt=""
                    className={classes.avatar}
                />
                <div className={classes.content}>
                    <div className={classes.name}>nhat</div>
                    <div className={classes.title}>hr at company</div>
                    <Button size="medium" outline className={classes.button}>
                        + Follow
                    </Button>
                </div>
            </div>
        </div>
    </div>);
};
