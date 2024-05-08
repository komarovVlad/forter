import { Container, Avatar, Typography } from '@mui/material';
import { createAvatar } from '@dicebear/core';
import { funEmoji, bottts } from '@dicebear/collection';
import { useMemo, PropsWithChildren } from 'react';
import { ANSWER_BOT_NAME } from './constants';
import { tss } from 'tss-react';

const useStyles = tss.create({
  container: {
    margin: '10px 0'
  },
  authorContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  author: {
    marginLeft: '10px',
    fontWeight: 'bold'
  },
  textContainer: {
    width: '90%',
    margin: '0 auto',
    background: '#ede9e9',
    borderRadius: '5px',
    padding: '15px'
  },
  avatar: {
    width: '30px',
    height: '30px'
  },
  avatarImageContainer: {
    '&>svg': {
      width: '30px',
      height: '30x'
    }
  }
});

interface Props extends PropsWithChildren {
  author: string;
}

export const Utterance = ({ author, children }: Props) => {
  const { classes } = useStyles();

  const avatar = useMemo(() => {
    return createAvatar<typeof bottts>(author === ANSWER_BOT_NAME ? bottts : funEmoji, {
      seed: author
    }).toString();
  }, [author]);

  return (
    <Container className={classes.container}>
      <Container className={classes.authorContainer}>
        <Avatar className={classes.avatar}>
          <div
            className={classes.avatarImageContainer}
            dangerouslySetInnerHTML={{ __html: avatar }}
          />
        </Avatar>
        <Typography variant="body1" className={classes.author}>
          {author}
        </Typography>
      </Container>
      <Container className={classes.textContainer}>
        <Typography variant="body2">{children}</Typography>
      </Container>
    </Container>
  );
};
