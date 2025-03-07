export const onRequestPost = async ({request, env}) => {
    const body = request.json()

    
    const auth = request.headers.get('Authorization')
    const asmaID = auth.split(' ')[1]

    console.log(asmaID)
    console.log(body)
    const query = env.DB.prepare(`SELECT 1 FROM users WHERE asma_id = "${asmaID}"`)
    const data = await query.run()

    console.log(data)


    return new Response(null)
}