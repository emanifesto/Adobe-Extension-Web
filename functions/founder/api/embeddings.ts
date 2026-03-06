interface Env{
    AI: any,
    DB: any,
    VECTOR: any,
}

interface Entry{
    id: number,
    notes: string
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

export const onRequestGet = async({request, env}: {request:Request, env:Env}) => {
    const {question} = await request.json()

    const embeddings = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
        text: question,
    })

    const vectors = embeddings.data[0]

    const vectorQuery = await env.VECTOR.query(vectors, {topK: 3})
    console.log(vectorQuery)

    let vecId

    if (vectorQuery.matches && vectorQuery.matches.length > 0 && vectorQuery.matches[0]){
        const vecId = vectorQuery.matches[0].id
    }

    let notes = []
    
    if (!vecId){
        return new Response(JSON.stringify({message:'Fail'}), {status: 400})
    } else {
        const query = `SELECT * FROM Documents WHERE id = ?`
        const {results} = await env.DB.prepare(query).bind(vecId).run()
        if (results)
            notes = results.map((entry: Entry) => entry.notes)
    }

    let context = ''
    if (notes.length > 0)
        context = `Context:\n${notes.map((note: string) => `- ${note}`).join('\n')}`

    const prompt = "When answering the question or responding, use the context provided, if it is provided and relevant."

    const {response: answer} = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
            context ? [{role: "system", content: context}]: [],
            {role: 'system', content: prompt},
            {role: 'user', content: question}
        ]
    })

    return new Response(JSON.stringify({
        answer: answer
    }), {status: 200})
}

export const onRequestDelete = async({request, env}: {request:Request, env: Env}) => {
    const {id} = await request.json()

    const query = `DELETE FROM Documents WHERE id = (?)`
    await env.DB.prepare(query).bind(id).run() 

    await env.VECTOR.deleteByIds([id])

    return new Response(JSON.stringify({message:'Success'}), {status: 200})
}