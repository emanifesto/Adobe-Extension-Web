
export const onRequestPost = async (context) => {

    const stripe = Stripe(context.env.STRIPE_SECRET)
    const endpointSecret = context.env.STRIPE_WH_SECRET

    console.log(context)
    console.log(context.request)
    return new Response(JSON.stringify({ content: `Connection successful! from ${context.env.STRIPE_WH_SECRET}`}), { status: 205, headers: {"Content-Type": "application/json"}})
}