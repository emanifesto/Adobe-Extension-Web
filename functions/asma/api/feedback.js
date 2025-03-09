
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
    let entries = "null"
    if(data.results[0]){
        entries = `asmaID - ${data.results[0].asma_id}\nstripeID - ${data.results[0].stripe_id}\nname - ${data.results[0].name}\nemail - ${data.results[0].email}\nbutton - ${data.results[0].metadata_button}\nautomation - ${data.results[0].hands_free}`
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
        method: "POST",
        headers: {"Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json"},
        body: JSON.stringify({
            from: `${env.ASMA_EMAIL}`,
            to: `${env.PERSONALs_EMAIL}`,
            subject: `${subject}`,
            text: `Feedback: ${feedback}\n\nCustomer email: ${email}\n\nDatabase entry:\n${entries}`
        })
    })

    if (emailResponse.ok){
        console.log(await emailResponse.json())
        return new Response({status: 200})
    }else{
        console.log(await emailResponse.json())
        return new Response({status: 400})
    }
}