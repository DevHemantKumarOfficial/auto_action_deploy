import "./footer.css";
import Separator from "../../../assets/images/Separator.svg"
const MainFooter = () => {
  return (
    <div className="footer">
      <div className="bottom-links-left">
        <div className="copyright">
          <div className="inphamed">© 2024 Inphamed</div>
        </div>
        <img className="separator-icon" alt="" src={Separator} />
        <div className="terms-of-use">
          <div className="inphamed">Terms of Use</div>
        </div>
        <img className="separator-icon" alt="" src={Separator} />
        <div className="privacy-statement">
          <div className="inphamed">Privacy Policy</div>
        </div>
      </div>
      <div className="bottom-links-right">
        <div className="about">
          <div className="inphamed">About</div>
        </div>
        <img className="separator-icon" alt="" src={Separator} />
        <div className="support">
          <div className="inphamed">Support</div>
        </div>
        <img className="separator-icon" alt="" src={Separator} />
        <div className="contact">
          <div className="inphamed">Contact</div>
        </div>
      </div>
    </div>

  )
}

export default MainFooter;