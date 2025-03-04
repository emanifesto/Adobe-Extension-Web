
export const onRequestPost = async (context) => {

    const endpointSecret = context.env.STRIPE_WH_SECRET

    console.log({full: `${context}`, body: `${context.request}`})
    return new Response(JSON.stringify({ content: `Connection successful! from ${endpointSecret}`}), { status: 205, headers: {"Content-Type": "application/json"}})
}