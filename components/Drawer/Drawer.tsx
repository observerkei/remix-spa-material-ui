import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import ContactList from '@/components/Contact/ContactList';

import SearchBar from '../SearchBar/SearchBar';
import CreateIcon from '@mui/icons-material/Create';
import DrawerBottom from './DrawerBottom';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { useMediaQuery } from 'react-responsive';
import { console_dbg } from '@/app/api/util';
import {
    ContactRecord,
} from '@/app/api/data';
import ToggleColorMode from '../ToggleColorMode/ToggleColorMode';

export const drawerWidth = 240;
export const mobileMaxWidth = 600;
export const appBarHeight = 56;
export const windowsMargin = 10;
export const desktopMinWidth = 1200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',

    paddingBottom: theme.spacing(1),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    [`@media (max-width: ${mobileMaxWidth}px)`]: {
        marginLeft: 0,
    },
    variants: [
        {
            props: ({ open }) => open,
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            },
        },
    ],
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                [`@media (min-width: ${mobileMaxWidth}px)`]: {
                    width: `calc(100% - ${drawerWidth}px)`,
                    marginLeft: `${drawerWidth}px`,
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

type DrawerParams = {
    contacts: ContactRecord[];
    children: React.ReactElement;
    urlFocusContactId: string;
};

export default function PersistentDrawerLeft({
    contacts,
    children,
    urlFocusContactId,
}: DrawerParams) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [focusContact, setFocusContact] = useState({} as ContactRecord);
    if (urlFocusContactId && !focusContact?.id) {
        console_dbg('update url f c : ', urlFocusContactId);
        const nowFocusContact: ContactRecord[] 
            = contacts.filter((c) => c.id == urlFocusContactId);
        if (nowFocusContact.length) {
         
        setFocusContact(nowFocusContact[0]);
        console_dbg("u f c id 2: ", JSON.stringify(nowFocusContact));
       
        }
    }

    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: mobileMaxWidth });

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
      };


    return (
        <Box sx={{ display: 'flex', flexGrow: 1, }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                mr: 2,
                            },
                            open && !isMobile && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Typography variant="h6" noWrap component="div" >
                            { focusContact?.id && focusContact.id.length !== 0 ? focusContact.name : "Favorite collection"}
                        </Typography>

                        <ToggleColorMode />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant={isMobile ? "temporary" : "persistent"}
                anchor="left"
                onClose={toggleDrawer(false)}
                open={open}
            >
                <DrawerHeader>
                    <SearchBar />
                    <IconButton onClick={() => {
                        if (focusContact?.id && focusContact.id.length !== 0) {
                            if (isMobile) {
                                setOpen(false);
                            }
                            navigate(`/c/${focusContact.id}/edit`);
                        }
                    }}>
                        <CreateIcon />
                    </IconButton>

                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <ContactList
                    contacts={contacts}
                    focusContact={focusContact}
                    setFocusContact={setFocusContact}
                    setOpen={(open: boolean) => setOpen(open)}
                />

                <DrawerBottom handleDrawerClose={handleDrawerClose}/>

            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Box sx={{ flexGrow: '1' }} >
                    {children}
                </Box>

            </Main>
        </Box>
    );
}
