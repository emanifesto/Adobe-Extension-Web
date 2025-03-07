
export const onRequestPost = async ({request, env}) => {


    // const endpointSecret = env.STRIPE_WH_SECRET
    const IPS = env.STRIPE_IPS.split(', ')
    const IP = request.headers.get("CF-Connecting-IP")

    if (!IPS.includes(IP)){
        return new Response({status: 400})
    }


    const body = await request.json()
    const event = body.type


    const info = body.data.object
    const stripeID = info.customer
    let update = null
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

            query = env.DB.prepare(`INSERT INTO users (asma_id, stripe_id, name, email, ${update}) VALUES (${asmaID}, ${stripeID}, ${name}, ${email}, "provisioned") ON CONFLICT(asma_id) DO UPDATE SET ${update} = "provisioned"`)
            await query.run()
            break

        case "customer.subscription.deleted":
            const product = info.plan.product //csd

            if (product === env.PRODUCT_1){
                update = "metadata_button"
            }else if (product === env.PRODUCT_2){
                update = "hands_free"
            }else{
                console.log(`Unexpected product ${product}`)
                break
            }

            query = env.DB.prepare(`UPDATE users SET ? = null WHERE stripe_id = ${stripeID}`)
            .bind(update)
            await query.run()
            break

        default:
            console.log(`Unexpected event type ${event}.`)
    }

    return new Response({ status: 205})//Response.status = 205;?
}