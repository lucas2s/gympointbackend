import { Op } from 'sequelize';
import { subDays, toDate, startOfDay, endOfDay } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Id student is not valid' });
    }

    const date = endOfDay(subDays(new Date(), 7));
    const day = new Date();

    const contCheckins = await Checkin.count({
      where: {
        student_id: id,
        created_at: {
          [Op.gt]: toDate(date),
        },
      },
    });

    if (contCheckins > 4) {
      return res
        .status(400)
        .json({ error: 'Student has 5 checkins in 7 days' });
    }

    const contDay = await Checkin.count({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [startOfDay(day), endOfDay(day)],
        },
      },
    });

    if (contDay > 0) {
      return res
        .status(400)
        .json({ error: 'Student already checked in today' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json({
      checkin,
    });
  }

  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Id student is not valid' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: id },
      attributes: ['id', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json({
      checkins,
    });
  }
}

export default new CheckinController();
