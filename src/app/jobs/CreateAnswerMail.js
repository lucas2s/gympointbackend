import Mail from '../../lib/Mail';

class CreateAnswerMail {
  get key() {
    return 'CreateAnswerMail';
  }

  async handle({ data }) {
    const { helpOrder, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Help Order Gynpoint',
      template: 'createAnswer',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new CreateAnswerMail();
