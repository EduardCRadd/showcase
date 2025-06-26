import classNames from "classnames";
import React, { FC, HTMLAttributes } from "react";

import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={classNames(styles.ring, className)} {...props}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
