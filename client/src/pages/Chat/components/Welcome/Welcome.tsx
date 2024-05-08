import { Container, Typography } from '@mui/material';
import { TextInput } from '../../../../common/components/TextInput/TextInput';
import { tss } from 'tss-react';

const useStyles = tss.create({
  heading: {
    marginBottom: '40px'
  },
  nameLabel: {
    marginBottom: '10px'
  }
});

interface Props {
  onNameSubmit: (name: string) => void;
}

export const Welcome = ({ onNameSubmit }: Props) => {
  const { classes } = useStyles();

  return (
    <Container data-testid="welcome">
      <Typography variant="h5" align="center" className={classes.heading}>
        Welcome to KnowledgeShare!
      </Typography>
      <Typography variant="body1" align="center" className={classes.nameLabel}>
        Please enter your name below
      </Typography>
      <TextInput label="Name" onSubmit={onNameSubmit}></TextInput>
    </Container>
  );
};
