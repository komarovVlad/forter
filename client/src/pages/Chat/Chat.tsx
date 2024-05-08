import { Box, Container, Paper, Typography } from '@mui/material';
import { useSocket } from './hooks';
import { Welcome } from './components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthor, getQuestions } from './selectors';
import { ChatSlice } from './slices';
import { useCallback } from 'react';
import { Question } from './components/Question';
import { TextInput } from '../../common/components/TextInput/TextInput';
import { tss } from 'tss-react';

const useStyles = tss.create({
  root: {
    background: '#e1e1e1',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    background: '#f3a4a4',
    padding: '20px',
    position: 'relative'
  },
  loader: {
    position: 'absolute',
    right: '20px',
    top: '20px'
  },
  content: {
    margin: '60px auto',
    padding: '40px',
    overflow: 'auto'
  },
  askYourQuestionlabel: {
    marginBottom: '10px'
  },
  questions: {
    width: '80vw'
  },
  askQuestionContainer: {
    marginBottom: '20px'
  }
});

export const Chat = () => {
  useSocket();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const author = useSelector(getAuthor);
  const questions = useSelector(getQuestions);

  const handleNameSubmit = useCallback((name: string) => {
    dispatch(ChatSlice.actions.setAuthor(name));
  }, []);
  const handleAskQuestion = useCallback((content: string) => {
    dispatch(ChatSlice.actions.askQuestion(content));
  }, []);
  const handleReply = useCallback(
    (content: string, questionId: string) => {
      dispatch(
        ChatSlice.actions.replyQuestion({
          questionId,
          content
        })
      );
    },
    [dispatch]
  );

  const getContent = () => {
    if (!author) {
      return <Welcome onNameSubmit={handleNameSubmit} />;
    }

    return (
      <Container className={classes.questions}>
        <Container className={classes.askQuestionContainer}>
          <Typography className={classes.askYourQuestionlabel} variant="h5">
            Ask your question!
          </Typography>
          <TextInput label="Question" onSubmit={handleAskQuestion} />
        </Container>
        {questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            onReply={handleReply}
            defaultExpanded={index === 0}
          />
        ))}
      </Container>
    );
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth={false} className={classes.header}>
        <Typography variant="h5" align="center">
          KnowledgeShare
        </Typography>
      </Container>
      <Paper className={classes.content}>{getContent()}</Paper>
    </Box>
  );
};
