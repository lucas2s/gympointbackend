import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import CreateAnswerMail from '../jobs/CreateAnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Id Help Order is not valid' });
    }

    await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpOrder.student_id);

    await Queue.add(CreateAnswerMail.key, {
      helpOrder,
      student,
    });

    return res.json({
      helpOrder,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: { [Op.ne]: null },
        answer_at: { [Op.ne]: null },
      },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: [
            'id',
            'name',
            'email',
            'birth_date',
            'age',
            'height',
            'weight',
          ],
        },
      ],
    });

    return res.json({
      helpOrders,
    });
  }
}

export default new AnswerController();
