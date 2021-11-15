import React from 'react';

function Header({ title, children }) {
  return (
    <div className="zoom-header">
      <h3>{title}</h3>
      <nav className="zoom-nav">{children}</nav>
    </div>
  );
}

export default Header;
