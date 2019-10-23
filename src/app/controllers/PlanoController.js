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

    const { id, title, duration, price} = await Plano.create(req.body);

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

    const { id } = req.params;

    const Plano = await Plano.findByPk(id);

    if (!Plano) {
      return res.status(400).json({ error: 'Id Plano is not valid' });
    }

    const { id, title, duration, price } = await Plano.update(req.body);

    return res.json({
        id,
        title,
        duration,
        price,
    });
  }
}

export default new PlanoController();
