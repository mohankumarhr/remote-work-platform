import * as React from 'react';
import Stack from '@mui/material/Stack';
import '../Styles/Teams.css'
import Avatar from '@mui/material/Avatar';


function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 32, // Reduced width
      height: 32, // Reduced height
      fontSize: '0.85rem', // Smaller font size
    },
    children: name.split(' ').length>1?`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`:`${name.split(' ')[0][0]}`,
  };
}

export default function BackgroundLetterAvatars(props) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar {...stringAvatar(props.name)} />
    </Stack>
  );
}



