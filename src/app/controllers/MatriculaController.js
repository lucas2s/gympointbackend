import * as Yup from 'yup';
import { addMonths, startOfDay, endOfDay, parseISO, isBefore } from 'date-fns';
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
        [end_date.gt]: dateStart,
      },
    });

    if (!checkMatricula) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
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

  /*
  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plano_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const plano = await Plano.findByPk(id);

    if (!plano) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
    }

    const { title, duration, price } = await plano.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
  }

  async index(req, res) {}
  */
}

export default new MatriculaController();
