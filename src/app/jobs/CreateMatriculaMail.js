import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateMatriculaMail {
  get key() {
    return 'CreateMatriculaMail';
  }

  async handle({ data }) {
    const { matricula, plano, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula Realizada com Sucesso',
      template: 'createMatricula',
      context: {
        studente: student.name,
        plano: plano.title,
        start_date: format(
          parseISO(matricula.start_date),
          "'Dia' dd 'de' MMMM 'de' yyyy '.'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(matricula.end_date),
          "'Dia' dd 'de' MMMM 'de' yyyy '.'",
          {
            locale: pt,
          }
        ),
        price: matricula.price,
      },
    });
  }
}

export default new CreateMatriculaMail();
