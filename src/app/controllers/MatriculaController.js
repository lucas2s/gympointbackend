import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Matricula from '../models/Matricula';
import Plano from '../models/Plano';
import Student from '../models/Student';

class PlanoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plano_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plano_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Id Student is not valid' });
    }

    const plano = await Plano.findByPk(plano_id);

    if (!plano) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
    }

    const dateStart = parseISO(start_date);

    console.log(start_date);
    console.log(dateStart);

    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    //    const { end_date, price } = await Plano.create(req.body);

    return res.json({ ok: 'ok' });

    //    return res.json({
    //      student_id,
    //      plano_id,
    //      start_date,
    //      end_date,
    //     price,
    //  });
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

export default new PlanoController();
