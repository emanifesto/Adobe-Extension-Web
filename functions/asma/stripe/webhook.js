import 'stripe'
import 'dotenv/config'

const stripe = stripe(process.env.STRIPE_SECRET)
const endpointSecret = process.env.STRIPE_WH_SECRET

export const onRequestPost = async (context) => {
    console.log(context)
    console.log(context.request)
    return new Response(JSON.stringify({ content: "Connection successful!"}), { status: 205, headers: {"Content-Type": "application/json"}})
}