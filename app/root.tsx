import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useCatch,
  useRouteError,
} from '@remix-run/react';
import type {LinksFunction} from '@remix-run/node';

import {Layout} from './components/Layout';

import globalStylesUrl from '~/styles/global.css';
import resetStylesUrl from '~/styles/reset.css';
import teamsStylesUrl from '~/styles/teams.css';

// https://remix.run/api/app#links
export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: resetStylesUrl,
    },
    {rel: 'stylesheet', href: globalStylesUrl},
    {rel: 'stylesheet', href: teamsStylesUrl},
  ];
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// https://remix.run/docs/en/1.15.0/pages/v2#catchboundary-and-errorboundary
export function ErrorBoundary() {
  const error = useRouteError() as any;

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{error?.message}</pre>
    </div>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#161616" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'true'}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bakbak+One&family=Open+Sans:wght@300&display=swap"
          rel="stylesheet"
        />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
