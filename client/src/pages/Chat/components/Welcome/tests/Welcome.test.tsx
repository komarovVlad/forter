import { render } from '@testing-library/react';
import { Welcome } from '../Welcome';
import userEvent from '@testing-library/user-event';

describe('<Welcome/>', () => {
  it('should render properly and handle user name input', async () => {
    const mockOnSubmit = jest.fn();

    const renderResult = render(<Welcome onNameSubmit={mockOnSubmit} />);

    expect(renderResult.getByTestId('welcome')).toBeInTheDocument();
    expect(renderResult.getByText('Welcome to KnowledgeShare!')).toBeInTheDocument();
    expect(renderResult.getByText('Please enter your name below')).toBeInTheDocument();

    const input = renderResult.getByRole('textbox');
    const button = renderResult.getByRole('button');
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    const testInput = 'test';

    await userEvent.type(input, testInput);
    await userEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith(testInput);
  });
});
