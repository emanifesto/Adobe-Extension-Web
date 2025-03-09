
export const onRequestPost = async({request, env}) => {

    const extensionID = env.EXTENSION_ID
    const origin = request.headers.get('origin')
    const body = await request.json()

    if (extensionID !== origin){
        return new Response({status: 400})
    }

    const auth = request.headers.get('Authorization')
    const asmaID = auth.split(' ')[1]

    const query = env.DB.prepare(`SELECT * FROM users WHERE asma_id = "${asmaID}"`)
    const data = await query.run()

    if (!data.results[0]){
        return new Response(JSON.stringify({status: 400}))
    }

    const email = body.email
    const subject = body.subject
    const feedback = body.feedback

    console.log(`${email} ${subject} ${feedback}`)
}