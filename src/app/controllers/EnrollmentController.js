import * as Yup from 'yup';
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

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      startDate: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, startDate } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Id Student is not valid' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Id Plan is not valid' });
    }
    
    const start_date = zonedTimeToUtc(parseISO(startDate),timeSP);

    if (isBefore(start_date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
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
      return res
        .status(400)
        .json({ error: 'There is registration for the chosen period' });
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

    return res.json({
      enrollment,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      startDate: Yup.date(),
    });

    const { id } = req.params;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, startDate } = req.body;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Id Enrollment is not valid' });
    }

    if (enrollment.canceled_at) {
      return res.status(400).json({ error: 'Enrollment is canceled' });
    }

    if (enrollment.start_date < new Date()) {
      return res.status(400).json({ error: 'Enrollment in period of term' });
    }

    const student = await Student.findByPk(student_id ? student_id : enrollment.student_id);
    if (!student) {
      return res.status(400).json({ error: 'Id Student is not valid' });
    }
    enrollment.student_id = student.id;
    

    const start_date = zonedTimeToUtc(parseISO(startDate ? startDate : enrollment.start_date),timeSP);
    if (isBefore(start_date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    enrollment.start_date = start_date;

    const plan = await Plan.findByPk(plan_id ? plan_id : enrollment.plan_id);
    if (!plan) {
         res.status(400).json({ error: 'Id Plan is not valid' });
    }
    enrollment.plan_id = plan.id;

    if (plan_id || start_date) {
      const end_date = endOfDay(addMonths(start_date, plan.duration));
      const price = plan.duration * plan.price;
      enrollment.end_date = end_date;
      enrollment.price = price;
    }

    const newEnrollment =await enrollment.save({enrollment});

    return res.json({
      newEnrollment,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Id Enrollment is not valid' });
    }

    if (enrollment.canceled_at) {
      return res.status(400).json({ error: 'Enrollment is canceled' });
    }

    enrollment.canceled_at = new Date();

    await enrollment.save();

    return res.json({
      enrollment,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      where: {
        canceled_at: null,
      },
      order: ['start_date'],
      attributes: [
        'id',
        'start_date',
        'end_date',
        'canceled_at',
        'price',
        'active',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    if (!enrollments) {
      return res.status(400).json({ error: 'There are no Enrollments' });
    }

    return res.json({
      enrollments,
    });
  }

  async indexByPk(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price', 'canceled_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    return res.json({
      enrollment,
    });
  }
}

export default new EnrollmentController();
