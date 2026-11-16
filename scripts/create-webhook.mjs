import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  const endpoint = await stripe.webhookEndpoints.create({
    url: "https://the-social-marketplace.vercel.app/api/stripe/webhook",
    enabled_events: [
      "checkout.session.completed",
      "payment_intent.succeeded",
      "account.updated",
    ],
    connect: true, // Set to false if charging on the platform account instead
  });

  console.log("Webhook created!");
  console.log("Endpoint ID:", endpoint.id);
  console.log("Signing Secret (save this!):", endpoint.secret);
}

main().catch((err) => {
  console.error("Failed to create webhook:", err.message);
  process.exit(1);
});
