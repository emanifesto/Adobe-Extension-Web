interface Env{
    AI: any,
    DB: any,
    VECTOR: any,
}

export const onRequestPost = async ({request, env}: {request: Request, env: Env}) => {

    const {notes} = await request.json()
    const query = `INSERT INTO Documents (notes) VALUES (?) RETURNING *`
    const data = await env.DB.prepare(query).bind(notes).run()
    console.log(data)
    const results = data.results

    if (!results){
        return new Response('Fail', {status: 400})
    }

    console.log(results)
    const id = results[0].id

    const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: notes,
    })

    if (!embeddings){
        return new Response('Fail', {status: 400})
    }

    console.log(embeddings)
    const values = embeddings.data[0]

    return new Response(JSON.stringify({
        'id': id,
        'full': results[0]
    }), {status: 200})
}