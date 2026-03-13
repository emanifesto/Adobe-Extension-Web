interface Env {
    AI: any,
    DB: any,
    VECTOR: any,
}


export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {

    const question = await request.text()

    const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: question,
    })

    if (!embeddings) {
        return new Response(JSON.stringify({ message: 'Fail' }), { status: 400 })
    }

    const values = embeddings.data[0]

    const vectorQuery = await env.VECTOR.query(values, { topK: 5 })

    if (!vectorQuery.matches || vectorQuery.matches.length === 0) {
        console.log('No matches found')
        return new Response(JSON.stringify({ message: 'No matches found' }), { status: 404 })
    }

    const ids = vectorQuery.matches.map((match: any) => match.id)
    console.log(ids)

    const placeholders = ids.map(() => '?').join(', ')
    const query = `SELECT * FROM Documents WHERE id IN (${placeholders})`
    const { results } = await env.DB.prepare(query).bind(...ids).run()
    console.log(results)

    if (!results || results.length === 0) {
        console.log('No documents found')
        return new Response(JSON.stringify({ message: 'No documents found' }), { status: 404 })
    }

    const context = results.map((r: any) => r.notes).join('\n\n')

    const systemPrompt = `You are a helpful assistant that answers questions about Emmanuel based on the following context. Only answer based on the provided context. If the answer is not in the context, say so.\n\nContext:\n${context}`
    console.log(systemPrompt)
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
        ],
    })
    console.log(response)

    return new Response(JSON.stringify({response: response.response}), { status: 200 })
}
