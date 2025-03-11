
export const onRequestPost = async ({request, env}) => {


    // const endpointSecret = env.STRIPE_WH_SECRET
    const IPS = env.STRIPE_IPS.split(', ')
    const IP = request.headers.get("CF-Connecting-IP")

    if (!IPS.includes(IP)){
        return new Response('Fail', {status: 400})
    }


    const body = await request.json()
    const event = body.type


    const info = body.data.object
    const stripeID = info.customer
    let product
    let update
    let query


    switch (event){
        case "checkout.session.completed":
            const asmaID = info.client_reference_id //csc
            const email = info.customer_details.email //csc
            const name = info.customer_details.name //csc
            const type = info.allow_promotion_codes //csc

            if (type){
                update = "hands_free" 
            }else{
                update = "metadata_button"
            }

            if (update === "metadata_button"){
                const trial_check = env.DB.prepare(`SELECT * FROM users WHERE asma_id = "${asmaID}"`)
                const trial_response = await trial_check.run()

                if (trial_response.results[0]){
                    const STRIPE_API_KEY = env.STRIPE_SECRET
                    const subscription = await fetch('https://api.stripe.com/v1/subscriptions', {
                        method: "POST",
                        headers: new Headers({
                            "Authorization": `Bearer ${STRIPE_API_KEY}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        }),
                        body: new URLSearchParams({
                            "customer": `${stripeID}`,
                            "items[]": `{price: ${env.PRODUCT_1_PRICE}}`
                        })
                    })

                    const sr = await subscription.json()
                    console.log(sr)
                }
            }

            query = env.DB.prepare(`INSERT INTO users (asma_id, stripe_id, name, email, ${update}) VALUES ("${asmaID}", "${stripeID}", "${name}", "${email}", "provisioned") ON CONFLICT(asma_id) DO UPDATE SET ${update} = "provisioned"`)
            await query.run()
            break

        case "customer.subscription.updated":
            
            product = info.plan.product //csd //csu
            let alt = null
            
            if (product === env.PRODUCT_1){
                update = "metadata_button"
                alt = "hands_free"
            }else if (product === env.PRODUCT_2){
                update = "hands_free"
                alt = "metadata_button"
            }else{
                console.log(`Unexpected product ${product}`)
                break
            }

            query = env.DB.prepare(`UPDATE users SET ${update} = "provisioned", ${alt} = "null" WHERE stripe_id = "${stripeID}"`)
            await query.run()
            break

        case "customer.subscription.deleted":

            product = info.plan.product //csd //csu

            if (product === env.PRODUCT_1){
                update = "metadata_button"
            }else if (product === env.PRODUCT_2){
                update = "hands_free"
            }else{
                console.log(`Unexpected product ${product}`)
                break
            }

            query = env.DB.prepare(`UPDATE users SET ${update} = "null" WHERE stripe_id = "${stripeID}"`)
            await query.run()
            break

        default:
            console.log(`Unexpected event type ${event}.`)
    }

    return new Response('Success', { status: 200})//Response.status = 205;?
}