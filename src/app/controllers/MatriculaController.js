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
import Matricula from '../models/Matricula';
import Plano from '../models/Plano';
import Student from '../models/Student';

class MatriculaController {
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

    const plano = await Plano.findByPk(plan_id);

    if (!plano) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
    }

    const dateStart = startOfDay(parseISO(start_date));
    if (isBefore(dateStart, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const checkMatricula = await Matricula.findOne({
      where: {
        student_id,
        end_date: {
          [Op.gte]: toDate(dateStart),
        },
      },
    });

    if (checkMatricula) {
      return res
        .status(400)
        .json({ error: 'There is registration for the chosen period' });
    }

    let end_date = addMonths(dateStart, plano.duration);
    end_date = endOfDay(end_date);
    const price = plano.duration * plano.price;

    const matricula = await Matricula.create({
      student_id,
      plan_id,
      start_date: dateStart,
      end_date,
      price,
    });

    return res.json({
      matricula,
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

    const matricula = await Matricula.findByPk(id);
    if (!matricula) {
      return res.status(400).json({ error: 'Id Matricula is not valid' });
    }

    if (matricula.start_date < new Date()) {
      return res.status(400).json({ error: 'Matricula in period of term' });
    }
    const matriculaUPD = matricula;

    if (student_id) {
      const student = await Student.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Id Student is not valid' });
      }
      matriculaUPD.student_id = student_id;
    }

    let dateStart;
    if (start_date) {
      dateStart = startOfDay(parseISO(start_date));
      if (isBefore(dateStart, startOfDay(new Date()))) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
      matriculaUPD.start_date = dateStart;
    } else {
      dateStart = matriculaUPD.start_date;
    }

    let plano;
    if (plan_id) {
      plano = await Plano.findByPk(plan_id);

      if (!plano) {
        return res.status(400).json({ error: 'Id Plano is not valid' });
      }
      matriculaUPD.plan_id = plan_id;
    } else {
      plano = await Plano.findByPk(matriculaUPD.plan_id);
    }

    if (plan_id || start_date) {
      let end_date = addMonths(dateStart, plano.duration);
      end_date = endOfDay(end_date);
      const price = plano.duration * plano.price;
      matriculaUPD.end_date = end_date;
      matriculaUPD.price = price;
    }

    await matricula.update(matriculaUPD);

    return res.json({
      matriculaUPD,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id);
    if (!matricula) {
      return res.status(400).json({ error: 'Id Matricula is not valid' });
    }

    const { student_id, plan_id, start_date, end_date, price } = matricula;

    await matricula.destroy();

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const matricula = await Matricula.findAll();

    if (!matricula) {
      return res.status(400).json({ error: 'Does not exist Matriculas' });
    }

    return res.json({
      matricula,
    });
  }
}

export default new MatriculaController();
