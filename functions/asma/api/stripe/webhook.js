
export const onRequestPost = async (context) => {

    console.log({full: `${context}`, body: `${context.request}`})

    const endpointSecret = "E-man"

    return new Response(JSON.stringify({ content: `Connection successful! from ${endpointSecret}`}), { status: 205, headers: {"Content-Type": "application/json"}})
}