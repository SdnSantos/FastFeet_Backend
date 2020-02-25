import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryStatusController {
  async index(req, res) {
    const { deliveryId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliveryId);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    return res.json(delivery);
  }
}

export default new DeliveryStatusController();
