import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'avatar_id', 'email'],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const delyverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (delyverymanExists) {
      return res.status(401).json('Deliveryman already exists');
    }

    const { id, name, avatar_id, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const { email } = req.body;

    if (email === deliveryman.email) {
      return res.status(401).json({ error: 'Delivery already exists' });
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const delivery = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!delivery) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    await delivery.destroy();

    return res.json({ Alert: 'Deliveryman deleted' });
  }
}

export default new DeliverymanController();
