class ElementHandler{
    constructor(client){
        this.client = client
    }

    element(element){
        element.setAttribute("client-reference-id", client)
    }

}





export async function onRequest({request, env, params}){
    const client = request.url.split('?')[1]

    const response = await env.ASSETS.fetch(request)
    
    if (client){
        return new HTMLRewriter().on('stripe-pricing-table', new ElementHandler(client)).transform(response)
    }

    return response
}