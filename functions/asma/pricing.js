class ClientHandler{
    constructor(client, client_secret){
        this.client = client
        this.client_secret = client_secret
    }

    element(element){
        const client = this.client
        element.setAttribute("client-reference-id", client)
        if (this.client_secret){
            const client_secret = this.client_secret
            element.setAttribute('customer-session-client-secret', client_secret)
        }
    }

}

export async function onRequest({request, env}){

    const client = request.url.split('?')[1]
    const response = await env.ASSETS.fetch(request)

    if (client){

        const query = env.DB.prepare(`SELECT * FROM users WHERE asma_id = "${client}"`)
        const data = await query.run()
        let client_secret = null


        if (data.results[0]){

            const STRIPE_API_KEY = env.STRIPE_SECRET
            const customer = data.results[0].stripe_id

            const customerSession = await fetch('https://api.stripe.com/v1/customer_sessions', {
                method: "POST",
                headers: new Headers({"Authorization": `Bearer ${STRIPE_API_KEY}`}),
                body: JSON.stringify({
                    "customer": `${customer}`,
                    "components": {
                        "pricing_table": {
                            "enabled": true,
                        },
                    },
                }),
            })
            console.log(customerSession)
            const csr = await customerSession.json()
            console.log(csr) //csr.error.type === "invalid_request_error"

            client_secret = csr.client_secret
            console.log(client_secret)

            // return new HTMLRewriter().on('stripe-pricing-table', new ClientHandler(client, client_secret)).transform(response)
        }


        return new HTMLRewriter().on('stripe-pricing-table', new ClientHandler(client, client_secret)).transform(response)
    }

    return response
}