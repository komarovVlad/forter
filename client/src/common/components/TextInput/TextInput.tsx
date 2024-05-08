import { Container, TextField, Button } from '@mui/material';
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { tss } from 'tss-react';

const useStyles = tss.create({
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  submitButton: {
    marginLeft: '10px'
  }
});

interface Props {
  label: string;
  onSubmit: (value: string) => void;
}

export const TextInput = ({ label, onSubmit }: Props) => {
  const { classes } = useStyles();
  const [value, setValue] = useState('');

  const handleValueChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  }, []);

  const handleNameSubmit = useCallback(
    (evt: FormEvent) => {
      evt.preventDefault();
      onSubmit(value);
      setValue('');
    },
    [onSubmit, value]
  );

  return (
    <Container>
      <form onSubmit={handleNameSubmit} className={classes.container}>
        <TextField
          label={label}
          value={value}
          onChange={handleValueChange}
          fullWidth
          data-testid="text-field"
        />
        <Button
          type="submit"
          className={classes.submitButton}
          variant="contained"
          disabled={value.length === 0}>
          Submit
        </Button>
      </form>
    </Container>
  );
};
