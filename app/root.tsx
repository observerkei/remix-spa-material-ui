import * as React from 'react';
import {
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  Outlet,
  useNavigate,
  redirect,
  Form,
  useSubmit,
} from '@remix-run/react';
import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import theme from './mui/theme';
import ClientStyleContext from './mui/ClientStyleContext';
import Layout from './mui/Layout';
import './tailwind.css'
import {
  getContacts,
  createEmptyContact,
  getContact,
  PageType
} from "~/api/data";
import { console_dbg } from '@/app/api/util';
import Drawer from '@/components/Drawer/Drawer';
import { LoaderFunctionArgs } from '@remix-run/node';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}


const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const clientStyleData = React.useContext(ClientStyleContext);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en" >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {title ? <title>{title}</title> : null}
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <meta name="emotion-insertion-point" content="emotion-insertion-point" />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
});


// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();
  const centerLayout = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
        break;
      case 404:
        message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
        break;

      default:
        throw new Error(error.data || error.statusText);
    }


    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <Layout>
          <div style={centerLayout}>
            <h1>
              {error.status}: {error.statusText}
            </h1>
            {message}
          </div>
        </Layout>
      </Document>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <Document title="Error!">
        <Layout>
          <div style={centerLayout}>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <hr />
            <p>Hey, developer, you should replace this with what you want your users to see.</p>
          </div>
        </Layout>
      </Document>
    );
  }

  return <h1>Unknown Error</h1>;
}


export const clientAction = async () => {
  const contact = await createEmptyContact();
  console_dbg('create.');
  return redirect(`/c/${contact.id}/edit`);
};


export const clientLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  let pageType = PageType.UNDEFINE;

  const contacts = await getContacts(q);
  var focusContactId = "";

  if (url.pathname === '/') {
    pageType = PageType.HOME;
  }
  
  console_dbg('root loader url: ', url.pathname)
  if (url.pathname.startsWith("/c/")) {
    const parts = url.pathname.split('/').filter(part => part !== '');
    // After dividing by "/c/", take the part before /
    focusContactId = parts[1] as string; 
    console_dbg('param path: ', JSON.stringify(parts));
    if (parts.length == 2 ) {
      pageType = PageType.CONTACT_DESCRIPT;
    } else if (parts.length == 3 && parts[2].endsWith('edit')) {
      pageType = PageType.CONTACT_EDIT
    }
  }

  return Response.json({ 
    contacts, 
    focusContactId, 
    pageType, 
    q,
  });
};


// https://remix.run/docs/en/main/route/component
// https://remix.run/docs/en/main/file-conventions/routes
export default function App() {
  const { 
    contacts, 
    focusContactId, 
    pageType, 
    q 
  } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const submit = useSubmit();

  console_dbg('App Home');
  console_dbg('contacts: ');
  console_dbg(JSON.stringify(contacts));
  console_dbg('focusContactId: ', JSON.stringify(focusContactId));

  return (
    <Document>
      <Layout>
        <Drawer
          contacts={contacts}
          urlFocusContactId={focusContactId}
          pageType={pageType}
          navigate={navigate}
          Form={Form}
          searchDefaultValue={q}
          submit={submit}
        >
          <Outlet />
        </Drawer>
      </Layout>
    </Document>
  );
}
