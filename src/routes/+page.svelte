<script>
  const appId = 'sandbox-sq0idb-H1cgz2Yv_r8bCaIKNp5IUg';
  const locationId = 'LCSH27KYTC1TW';

  let card;

  async function tokenize(paymentMethod) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }

      throw new Error(errorMessage);
    }
  }

  async function setup() {
    if (!Square) {
      throw new Error('Square.js failed to load properly');
    }
    const payments = Square.payments(appId, locationId);
    try {
      card = await payments.card();
      await card.attach('#card-container');
    } catch (e) {
      console.error('Initializing Card failed', e);
      return;
    }
  }

  async function createPayment() {
    const token = await tokenize(card);
    const paymentResponse = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        locationId,
        sourceId: token
      })
    });

    if (paymentResponse.ok) {
      return paymentResponse.json();
    }
    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  }

  async function handlePaymentMethodSubmission() {
    try {
      const paymentResults = await createPayment();
      console.log('Payment Success', paymentResults);
    } catch (e) {
      console.error(e.message);
    }
  }
</script>

<form on:submit|preventDefault={handlePaymentMethodSubmission}>
  {#await setup()}
    <p>...waiting</p>
  {/await}
  <div id="card-container" />
  <button>Pay $1.00</button>
</form>

<style>
  button {
    color: #ffffff;
    background-color: #006aff;
    border-radius: 5px;
    cursor: pointer;
    border-style: none;
    user-select: none;
    outline: none;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 12px;
    width: 100%;
    box-shadow: 1px;
  }

  button:active {
    background-color: rgb(0, 85, 204);
  }

  button:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.3);
  }
</style>
