import githubLogo from "../../public/icons/github-logo.png";
import linkedinLogo from "../../public/icons/linkedin-logo.png";

function Footer() {
  return (
    <footer className="bg-blue-500 px-5 py-5">
      <div className="footer-contact-info">
        <ul className="space-y-4">
          <li className="flex space-x-2">
            <img className="h-6" alt="github" src={githubLogo}></img>
            <span className="font-semibold text-blue-100">Github</span>
          </li>
          <li className="flex space-x-1">
            <img className="h-6" alt="github" src={linkedinLogo}></img>
            <label className="font-semibold text-blue-100">LinkedIn</label>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
