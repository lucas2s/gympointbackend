import * as Yup from 'yup';
import Plano from '../models/Plano';

class PlanoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await Plano.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
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

    const plano = await Plano.findByPk(id);

    if (!plano) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
    }

    const { title, duration, price } = plano;

    await plano.destroy();

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const planos = await Plano.findAll();

    return res.json({
      planos,
    });
  }
}

export default new PlanoController();
