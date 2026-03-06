// interface Env{
//     AI: any,
//     DB: any,
//     VECTOR: any,
// }

// interface Entry{
//     id: number,
//     notes: string
// }

// export const onRequestPost = async({request, env}: {request:Request, env:Env}) => {
//     const {question} = await request.json()

//     const embeddings = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
//         text: question,
//     })

//     const vectors = embeddings.data[0]

//     const vectorQuery = await env.VECTOR.query(vectors, {topK: 3})
//     console.log(vectorQuery)

//     let vecId

//     if (vectorQuery.matches && vectorQuery.matches.length > 0 && vectorQuery.matches[0]){
//         const vecId = vectorQuery.matches[0].id
//     }

//     let notes = []
    
//     if (!vecId){
//         return new Response(JSON.stringify({message:'Fail'}), {status: 400})
//     } else {
//         const query = `SELECT * FROM Documents WHERE id = ?`
//         const {results} = await env.DB.prepare(query).bind(vecId).run()
//         if (results)
//             notes = results.map((entry: Entry) => entry.notes)
//     }

//     let context = ''
//     if (notes.length > 0)
//         context = `Context:\n${notes.map((note: string) => `- ${note}`).join('\n')}`

//     const prompt = "When answering the question or responding, use the context provided, if it is provided and relevant."

//     const {response: answer} = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
//         messages: [
//             context ? [{role: "system", content: context}]: [],
//             {role: 'system', content: prompt},
//             {role: 'user', content: question}
//         ]
//     })

//     return new Response(JSON.stringify({
//         answer: answer
//     }), {status: 200})
// }

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
