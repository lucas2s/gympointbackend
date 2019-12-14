import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, parseISO } from 'date-fns';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      birth_date: Yup.date().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { birth_date } = req.body;
    const birthDate = startOfDay(parseISO(birth_date));

    req.body.birth_date = birthDate;

    const { id, email, name, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      email,
      name,
      birth_date,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      birth_date: Yup.date(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Id student is not valid' });
    }

    const { email } = req.body;

    if (email) {
      if (email !== student.email) {
        const studentExists = await Student.findOne({ where: { email } });

        if (studentExists) {
          return res.status(400).json({ error: 'Student already exists.' });
        }
      }
    }

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async index(req, res) {
    const { student, page = 1 } = req.query;

    const students = await Student.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        name: {
          [Op.iLike]: `%${student}%`,
        },
      },
    });

    if (!students.length) {
      return res.status(400).json({ error: 'There are no students' });
    }

    return res.json({
      students,
    });
  }
}

export default new StudentController();
