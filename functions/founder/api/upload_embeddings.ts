interface Env{
    AI: any,
    DB: any,
    VECTOR: any,
}

export const onRequestPost = async ({request, env}: {request: Request, env: Env}) => {
    console.log(request)

    const {notes} = await request.json()
    console.log(notes)
    const query = `INSERT INTO Documents notes VALUES (?)`
    const { results } = env.DB.prepare(query).bind(notes).run()

    if (!results){
        return new Response('Failed', {status: 400})
    }

    const id = results[0].id

    return new Response(JSON.stringify({
        'id': id,
        'full': results[0]
    }), {status: 200})
}