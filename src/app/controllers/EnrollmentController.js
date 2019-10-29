import * as Yup from 'yup';
import {
  addMonths,
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  toDate,
} from 'date-fns';

import { Op } from 'sequelize';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import CreateEnrollmentMail from '../jobs/CreateEnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Id Student is not valid' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Id Plan is not valid' });
    }

    const dateStart = startOfDay(parseISO(start_date));
    if (isBefore(dateStart, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const checkEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        canceled_at: null,
        end_date: {
          [Op.gte]: toDate(dateStart),
        },
      },
    });

    if (checkEnrollment) {
      return res
        .status(400)
        .json({ error: 'There is registration for the chosen period' });
    }

    let end_date = addMonths(dateStart, plan.duration);
    end_date = endOfDay(end_date);
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: dateStart,
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
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, student_id, plan_id, start_date } = req.body;

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

    if (student_id) {
      const student = await Student.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Id Student is not valid' });
      }
      enrollment.student_id = student_id;
    }

    let dateStart;
    if (start_date) {
      dateStart = startOfDay(parseISO(start_date));
      if (isBefore(dateStart, startOfDay(new Date()))) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
      enrollment.start_date = dateStart;
    } else {
      dateStart = enrollment.start_date;
    }

    let plan;
    if (plan_id) {
      plan = await Plan.findByPk(plan_id);

      if (!plan) {
        return res.status(400).json({ error: 'Id Plan is not valid' });
      }
      enrollment.plan_id = plan_id;
    } else {
      plan = await Plan.findByPk(enrollment.plan_id);
    }

    if (plan_id || start_date) {
      let end_date = addMonths(dateStart, plan.duration);
      end_date = endOfDay(end_date);
      const price = plan.duration * plan.price;
      enrollment.end_date = end_date;
      enrollment.price = price;
    }

    await enrollment.save();

    return res.json({
      enrollment,
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
      attributes: ['id', 'start_date', 'end_date', 'price', 'canceled_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
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
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(400).json({ error: 'Does not exist Enrollments' });
    }

    return res.json({
      enrollment,
    });
  }
}

export default new EnrollmentController();
