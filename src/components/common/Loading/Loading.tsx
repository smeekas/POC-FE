import { Loader } from '@mantine/core';
import styles from './Loading.module.css';

function Loading() {
  return (
    <div className={styles.loading_container}>
      <Loader className={styles.loader}/>
    </div>
  );
}

export default Loading;
