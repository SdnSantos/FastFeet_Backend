import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cadastro de encomenda',
      template: 'delivery',
      context: {
        nameDeliveryman: deliveryman.name,
        product,
        nameRecipient: recipient.name,
        streetRecipient: recipient.street,
        numberRecipient: recipient.number,
        complementRecipient: recipient.complement,
        stateRecipient: recipient.state,
        cityRecipient: recipient.city,
        zip_codeRecipient: recipient.zip_code,
      },
    });
  }
}

export default new DeliveryMail();
