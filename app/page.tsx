import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>1st Digital Infantry</h1>
        <Link href="/tanks">Tanks</Link>
      </main>
    </div>
  );
}
