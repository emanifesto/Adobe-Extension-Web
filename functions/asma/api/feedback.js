
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

    // if (!data.results[0]){
    //     return new Response(JSON.stringify({status: 400}))
    // }

    const email = body.email
    const subject = body.subject
    const feedback = body.feedback

    const emailResponse = await fetch('https://api.resend.com/emails', {
        method: "POST",
        headers: {"Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json"},
        body: JSON.stringify({
            from: `${env.ASMA_EMAIL}`,
            to: `${env.PERSONAL_EMAIL}`,
            subject: `${subject}`,
            text: `Feedback: ${feedback}\n\nCustomer email: ${email}\n\nDatabase entry:\n${data.results[0]}`
        })
    })

    if (emailResponse.ok){
        return new Response({status: 200})
    }else{
        return new Response({status: 400})
    }
}