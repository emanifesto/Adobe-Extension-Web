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

    console.log(data)
    console.log(data.results['metadata_button'])
    console.log(data.results['hands_free'])

    console.log(data.results.metadata_button)
    console.log(data.results.hands_free)


    return new Response(JSON.stringify({payment: null}))
}