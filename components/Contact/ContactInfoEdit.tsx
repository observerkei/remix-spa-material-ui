import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Form,
} from "@remix-run/react";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { desktopMinWidth } from '@/components/Drawer/Drawer';
import { useMediaQuery } from 'react-responsive';
import { ContactRecord } from '~/api/data';
import { console_dbg } from '~/api/util';


export default function ContactInfoEdit({ contact }: { contact: ContactRecord }) {
  const [editContact, setEditContact] = React.useState({} as ContactRecord);
  const isDesktop = useMediaQuery({ minWidth: desktopMinWidth });

  if (JSON.stringify(contact) !== JSON.stringify(editContact)) {
    setEditContact(contact);
  }

  console_dbg(`input contact: ${JSON.stringify(contact)}`);

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: '1',
        alignSelf: 'stretch',
        marginTop: '25px',
        padding: '20px',

      }}>

        <Box sx={isDesktop ? {
          '& > :not(style)': { m: 1 },
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        } : {
          '& > :not(style)': { m: 1 },
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          
          <Avatar
            alt={`Avatar n°${editContact.id}-1`}
            src={editContact?.profilePictureURI || ""}
            style= {{
              width: 200,
              height: 200,
            }}
          />

          <Form id="contact-from" role="send" style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: isDesktop ? '800px' : '600px',
            width: '100%',
            flexGrow: 1,
            margin: 50,

          }}>

            <TextField
              id="standard-basic"
              label="Account name"
              variant="standard"
              value={editContact?.name || ""}
            />
            <br />

            <TextField
              id="standard-basic"
              label="Profile picture"
              variant="standard"
              value={editContact?.profilePictureURI || ""} 
            />
            <br />
            
            <TextField
              id="standard-basic"
              label="Description Page"
              variant="standard"
              value={editContact?.descriptionURI || ""}
            />
            <br />

            <TextField
              id="standard-multiline-static"
              label="Description"
              multiline
              rows={4}
              value={editContact?.description || ""}
              variant="standard" 
              />
            <br />

          </Form>

        </Box>

        <Box sx={{
          display: 'flex',
          gap: '50px',
        }}>
        
        <Form method="post" style={{ alignSelf: 'center', }}>
          <Button variant="contained" type="submit">Save</Button>
        </Form>

        
        <Form method="post" action={`/c/${contact.id}/delete`} style={{ alignSelf: 'center', }}>
          <Button color='error' variant="contained" type="submit">Delete</Button>
        </Form>
        </Box>

      </Box>

    </>
  );
}