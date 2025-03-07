
export const onRequestPost = async ({request, env}) => {


    // const endpointSecret = env.STRIPE_WH_SECRET
    const IPS = env.STRIPE_IPS
    const IP = request.headers.get("CF-Connecting-IP")
    console.log(IPS)
    if (!IPS.includes(IP)){
        return new Response({status: 400})
    }

    const body = await request.json()
    const event = body.type


    const info = body.data.object
    const stripeID = info.customer
    let update = null


    console.log({IP: `${IP}`, sss: `${endpointSecret}`, event: `${event}`, data: `${info}`})

    switch (event){
        case "checkout.session.completed":
            const asmaID = info.client_reference_id //csc
            const email = info.customer_details.email //csc
            const name = info.customer_details.name //csc
            const type = info.allow_promotion_codes //csc

            if (type){
                update = "hands free access" 
            }else{
                update = "metadata button access"
            }

            console.log({asmaID: `${asmaID}`, stripeID: `${stripeID}`, name: `${name}`, email: `${email}`, thingToUpdate: `${update}`})
            break

        case "customer.subscription.deleted":
            const product = info.plan.product //csd

            if (product === env.PRODUCT_1){
                update = "metadata button access"
            }else if (product === env.PRODUCT_2){
                update = "hands free access"
            }else{
                console.log(`Unexpected product ${product}`)
            }

            console.log({stripeID: `${stripeID}`, thingToUpdate: `${update}`})
            break

        default:
            console.log(`Unexpected event type ${event}.`)
    }

    return new Response({ status: 205})//Response.status = 205;?
}