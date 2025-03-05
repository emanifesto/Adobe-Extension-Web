
export const onRequestPost = (context) => {//onRequestPost


    const endpointSecret = context.env.STRIPE_WH_SECRET
    const IP = context.request.headers['x-real-ip']
    //some verification code

    const event = context.request.body.type
    const info = context.request.body.data['object']
    const stripeID = info.customer


    console.log({IP: `${IP}`, sss: `${endpointSecret}`, event: `${event}`, data: `${info}`})

    switch (event){
        case "checkout.session.completed":
            const asmaID = info.client_reference_id //csc
            const email = info.customer_details.email //csc
            const name = info.customer_details.name //csc
            const type = info.allow_promotion_codes //csc

            if (type){
                const update = "hands free access" 
            }else{
                const update = "metadata button access"
            }

            console.log({asmaID: `${asmaID}`, stripeID: `${stripeID}`, name: `${name}`, email: `${email}`, thingToUpdate: `${update}`})
            break

        case "customer.subscription.deleted":
            const product = info.plan.product //csd
            const update = ""

            if (product === context.env.PRODUCT_1){
                let update = "metadata button access"
            }else if (product === context.env.PRODUCT_2){
                let update = "hands free access"
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