import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Question as QuestionType } from '../../types';
import { Utterance } from '../Utterance';
import { TextInput } from '../../../../common/components/TextInput/TextInput';
import { useCallback } from 'react';
import { tss } from 'tss-react';

const useStyles = tss.create({
  container: {
    padding: '20px'
  },
  detailsContainer: {
    marginLeft: '100px',
    background: '#d8d8d8',
    borderRadius: '5px',
    marginBottom: '20px'
  }
});

interface Props {
  question: QuestionType;
  onReply: (content: string, questionId: string) => void;
  defaultExpanded?: boolean;
}

export const Question = ({ question, onReply, defaultExpanded }: Props) => {
  const { classes } = useStyles();

  const handleReply = useCallback(
    (content: string) => {
      onReply(content, question.id);
    },
    [onReply, question]
  );

  return (
    <Accordion className={classes.container} defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Utterance author={question.author}>{question.content}</Utterance>
      </AccordionSummary>
      {question.replies.length > 0 && (
        <AccordionDetails className={classes.detailsContainer}>
          {question.replies.map((reply, index) => (
            <Utterance author={reply.author} key={index}>
              {reply.content}
            </Utterance>
          ))}
        </AccordionDetails>
      )}
      <TextInput label="Reply to question" onSubmit={handleReply} />
    </Accordion>
  );
};
