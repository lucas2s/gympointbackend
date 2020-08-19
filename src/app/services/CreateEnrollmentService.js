import {
  addMonths,
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  toDate,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Op } from 'sequelize';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import CreateEnrollmentMail from '../jobs/CreateEnrollmentMail';
import Queue from '../../lib/Queue';

const timeSP = 'America/Sao_Paulo';

class CreateEnrollmentService {
  async run({ student_id, plan_id, startDate }) {
    const student = await Student.findByPk(student_id);

    if (!student) {
      throw new Error('Id Student is not valid');
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      throw new Error('Id Plan is not valid');
    }

    const start_date = zonedTimeToUtc(parseISO(startDate), timeSP);

    if (isBefore(start_date, startOfDay(new Date()))) {
      throw new Error('Past dates are not permitted');
    }

    const checkEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        canceled_at: null,
        end_date: {
          [Op.gte]: toDate(start_date),
        },
      },
    });

    if (checkEnrollment) {
      throw new Error('There is registration for the chosen period');
    }

    const end_date = endOfDay(addMonths(start_date, plan.duration));
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(CreateEnrollmentMail.key, {
      enrollment,
      plan,
      student,
    });

    return enrollment;
  }
}

export default new CreateEnrollmentService();
