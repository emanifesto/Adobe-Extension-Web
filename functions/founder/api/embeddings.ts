interface Env{
    AI: any,
    DB: any,
    VECTOR: any,
}


export const onRequestPost = async ({request, env}: {request: Request, env: Env}) => {

    const {notes} = await request.json()
    const query = `INSERT INTO Documents (notes) VALUES (?) RETURNING *`
    const {results} = await env.DB.prepare(query).bind(notes).run()

    if (!results){
        return new Response(JSON.stringify({message:'Fail'}), {status: 400})
    }

    const id = results[0].id


    const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: notes,
    })

    if (!embeddings){
        return new Response(JSON.stringify({message:'Fail'}), {status: 400})
    }

    const values = embeddings.data[0]


    const final = await env.VECTOR.upsert([
        {
            id: id.toString(),
            values: values,
        }
    ])

    console.log(final)
    return new Response(JSON.stringify({message:'Success'}), {status: 200})
}

export const onRequestDelete = async({request, env}: {request:Request, env: Env}) => {
    const {id} = await request.json()

    const query = `DELETE FROM Documents WHERE id = (?)`
    await env.DB.prepare(query).bind(id).run()

    await env.VECTOR.deleteByIds([id])

    return new Response(JSON.stringify({message:'Success'}), {status: 200})
}