import { type FC } from "react"

import styles from "./ActionLink.module.scss";

type LinkType = {
    name: string,
    onClick: () => void
}

const ActionLink: FC<LinkType> = ({ name, onClick }) => {
    return (
        <div className={styles.linkStyle} onClick={onClick}> {name}</div>
    )
}

export default ActionLink;