import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="Layout">
      <div>
        <header>
          <h1>MAKE YOUR PICKS</h1>
        </header>
        <main>{children}</main>
      </div>
      <footer className="Footer">
        Made by Andrew McGoveran
      </footer>
    </div>
  );
}
