class ElementHandler{
    constructor(client){
        this.client = client
    }

    element(element){
        element.setAttribute("client-reference-id", client)
    }

}





export async function onRequest({request, env, params}){
    // const client = 
    const b = await request.json()
    console.log(b)
    // console.log(b.)


    const response = await env.ASSETS.fetch(request)

    return new Response({status: 200})
    return new HTMLRewriter().on('stripe-pricing-table', new ElementHandler(client)).transform(response)
}