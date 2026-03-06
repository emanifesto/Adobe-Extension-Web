interface Env{
    AI: any,
    DB: any,
    VECTOR: any,
}

export const onRequestPost = async ({request, env}: {request: Request, env: Env}) => {

    const {notes} = await request.json()
    const query = `INSERT INTO Documents notes VALUES (?)`
    const data = env.DB.prepare(query).bind(notes).run()

    console.log(data)
    return new Response('OK', {status: 200})
} 

    // const id = results[0].id

    // return new Response(JSON.stringify({
    //     'id': id,
    //     'full': results[0]
    // }), {status: 200})
// }