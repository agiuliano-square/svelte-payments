import { json } from '@sveltejs/kit';
import { Client } from 'square';
import { randomUUID } from 'crypto';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN,
  environment: 'sandbox'
});

export async function POST({ request }) {
  const { locationId, sourceId } = await request.json();
  console.log(locationId, sourceId);
  try {
    const response = await paymentsApi.createPayment({
      locationId,
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: 100,
        currency: 'USD'
      }
    });
    console.log(response.result);

    return json(response.result);
  } catch (error) {
    console.log(error);
  }
}
