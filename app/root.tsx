import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
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

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({error}: {error: Error}) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
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
