
export const onRequest = () => {

    console.log({message: "Hi!"});
    return new Response("Hello.");

    // const endpointSecret = "E-man"

    // return new Response(JSON.stringify({ content: `Connection successful! from ${endpointSecret}`}), { status: 205, headers: {"Content-Type": "application/json"}})
}