import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Cache from '../../lib/Cache';

class QuestionController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Id student is not valid' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    await Cache.invalidatePrefix(`user:${id}`);

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: { answer: null, answer_at: null },
      attributes: ['id', 'question', 'created_at'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async indexByStudent(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const cacheKey = `user:${id}:questions:${page}`;
    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Id student is not valid' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: id },
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Cache.set(cacheKey, helpOrders);

    return res.json(helpOrders);
  }
}

export default new QuestionController();
