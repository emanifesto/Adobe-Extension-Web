
export const onRequest = (context) => {

    console.log({fullRequest: `${context}`, requestBody: `${context.request}`, environment: `${context.env}`});

    const endpointSecret = context.env.STRIPE_WH_SECRET

    return new Response(JSON.stringify({ content: `Connection successful! from ${endpointSecret}`}), { status: 202, headers: {"Content-Type": "application/json"}})
}