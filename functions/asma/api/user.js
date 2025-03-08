export const onRequestPost = async ({request, env}) => {

    const extensionID = env.EXTENSION_ID
    const origin = request.headers.get('origin')
    const body = await request.json()

    if (extensionID !== origin){
        return new Response({status: 400})
    }

    if (body.info !== "payment"){
        return new Response({status: 400})
    }

    const auth = request.headers.get('Authorization')
    const asmaID = auth.split(' ')[1]

    const query = env.DB.prepare(`SELECT * FROM users WHERE asma_id = "${asmaID}"`)
    const data = await query.run()
    
    if (!data.results){
        return new Response(JSON.stringify({payment: null}))
    }

    const prod_1 = data.results[0].metadata_button
    const prod_2 = data.results[0].hands_free

    if (prod_2 === "provisioned"){
        return new Response(JSON.stringify({payment: "hands free"}))
    }

    if (prod_1 === "provisioned"){
        return new Response(JSON.stringify({payment: "metadata button"}))
    }

    return new Response(JSON.stringify({payment: null}))
}