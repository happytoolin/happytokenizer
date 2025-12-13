import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.linkGroup}>
        {/* Models Link */}
        <a href="/models" className={styles.link}>
          <svg className={styles.icon} viewBox="0 0 24 24">
            <path d="M21 16H3V4H21V16ZM21 18H3C2.44772 18 2 17.5523 2 17V3C2 2.44772 2.44772 2 3 2H21C21.5523 2 22 2.44772 22 3V17C22 17.5523 21.5523 18 21 18ZM6 20H18V22H6V20Z" />
          </svg>
          <span>Models</span>
        </a>

        <div className={styles.separator} />

        {/* GitHub Link */}
        <a
          href="https://github.com/happytokenizer/happytokenizer"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <svg className={styles.icon} viewBox="0 0 24 24">
            <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.418 4.86598 20.166 8.83998 21.489C9.34098 21.579 9.51598 21.273 9.51598 21.011C9.51598 20.776 9.50598 19.99 9.50098 19.102C6.72098 19.704 6.13498 17.923 6.13498 17.923C5.67998 16.768 5.02498 16.46 5.02498 16.46C4.11798 15.84 5.09398 15.852 5.09398 15.852C6.09798 15.923 6.62598 16.883 6.62598 16.883C7.51698 18.41 8.96198 17.969 9.52998 17.714C9.62098 17.068 9.87898 16.628 10.165 16.379C7.94598 16.127 5.61298 15.269 5.61298 11.439C5.61298 10.348 6.00098 9.457 6.64398 8.753C6.54198 8.5 6.19898 7.481 6.74198 6.107C6.74198 6.107 7.57698 5.839 9.47698 7.127C10.271 6.906 11.123 6.796 11.972 6.792C12.821 6.796 13.673 6.906 14.468 7.127C16.367 5.839 17.201 6.107 17.201 6.107C17.745 7.481 17.402 8.5 17.3 8.753C17.944 9.457 18.331 10.348 18.331 11.439C18.331 15.279 15.994 16.124 13.766 16.372C14.12 16.677 14.436 17.279 14.436 18.201C14.436 19.523 14.423 20.592 14.423 21.011C14.423 21.276 14.596 21.585 15.106 21.488C19.077 20.163 21.94 16.417 21.94 12C21.94 6.475 17.465 2 11.94 2L12.001 2Z" />
          </svg>
          <span>Source</span>
        </a>

        <div className={styles.separator} />

        {/* Brand Link */}
        <a
          href="https://twitter.com/happytokenizer"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <span>@happytokenizer</span>
        </a>
      </div>

      <div className={styles.version}>v2.0</div>
    </footer>
  );
}
