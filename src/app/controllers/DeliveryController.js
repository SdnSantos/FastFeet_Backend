import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

import DeliveryMail from '../jobs/DeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const deliviries = await Delivery.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'product'],
      include: [
        // {
        //   model: File,
        //   as: 'signature',
        //   attributes: ['id', 'name', 'path'],
        // },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
      ],
    });

    return res.json(deliviries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const { product } = await Delivery.create(req.body);

    await Queue.add(DeliveryMail.key, {
      deliveryman,
      product,
      recipient,
    });

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery does not exists' });
    }

    const { recipient_id, deliveryman_id, product } = await delivery.update(
      req.body
    );

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();

    return res.json({ Alert: 'Delivery deleted' });
  }
}

export default new DeliveryController();
