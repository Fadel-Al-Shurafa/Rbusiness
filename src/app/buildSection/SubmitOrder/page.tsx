import styles from "../loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingAnimation}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
