import styles from "../../CSS/Footer.module.css"

function Footer() {
    return (
        <footer className={styles.footer}>
          <p>© 2026 HealthNest. All rights reserved.</p>
          <div className={styles.socialIcons}>
            Contact us:
            <a href="#">🔵</a>
            <a href="#">🐦</a>
            <a href="#">📸</a>
          </div>
      </footer>
    );
}

export default Footer;