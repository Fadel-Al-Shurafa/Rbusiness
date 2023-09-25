import styles from "../build.module.css";
import Link from "next/link";
import Header from ".././components/header";
export default function BuildSection() {
  return (
    
    <div className={styles.mainBuildSection}>
      <Header />
      <div className={styles.buildcontainer}>
        <div className={styles.buildflex}>
          <h1> Choice to start your business  </h1>
        </div>
        <div className={styles.buildflex}>
          <div className={styles.buildcontainerbox}>
            <div className={styles.buildflexBox}>
              <Link href="/buildSection/restaurant"><h3> Build Restaurant </h3></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
