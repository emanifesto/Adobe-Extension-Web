
export const onRequest = (context) => {

    console.log({message: "Hi!"});
    return new Response("Hello.", {status: 205});

    // const endpointSecret = "E-man"

    // return new Response(JSON.stringify({ content: `Connection successful! from ${endpointSecret}`}), { status: 205, headers: {"Content-Type": "application/json"}})
}