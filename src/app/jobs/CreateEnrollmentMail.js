import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateEnrollmentMail {
  get key() {
    return 'CreateEnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, plan, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Enrollment Realizada com Sucesso',
      template: 'createEnrollment',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(
          parseISO(enrollment.start_date),
          "'Dia' dd 'de' MMMM 'de' yyyy '.'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "'Dia' dd 'de' MMMM 'de' yyyy '.'",
          {
            locale: pt,
          }
        ),
        price: enrollment.price,
      },
    });
  }
}

export default new CreateEnrollmentMail();
