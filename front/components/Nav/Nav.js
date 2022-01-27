
import React from "react";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__links nav__links--desktop">
        <a className="logo" title="Home">
        
          <span className="logo__text">GRBCHAT</span>
        </a>
        <div className="nav__links__inner">
          {/* <a class="nav__link" title="Check">
            Check
          </a>
          <a className="nav__link" title="Generate">
            Generate
          </a>
          <a className="nav__link" title="Resources">
            Resources
          </a> */}
        </div>
      </div>
    </nav>
  );
}
