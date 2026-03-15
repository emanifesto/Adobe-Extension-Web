export const onRequestGet = async ({request, env}: {request: Request, env: {AI: any}}) => {

    const jobTitles = ["Software Engineer", "Java Instructor", "AI/ML Researcher"]
    const artSytles = ["Anime", "Comic", "Pop", "Surrealism", "Cubism", "Chibi"]

    const idx1 = Math.floor(Math.random() * jobTitles.length)
    const idx2 = Math.floor(Math.random() * artSytles.length)

    const job = jobTitles[idx1]
    const style = artSytles[idx2]

    console.log(job,style)
    
    const form = new FormData()
    form.append('prompt', `A scene focused on a male African-American ${job}. ${style} art-style.`)
    form.append('width', '960')
    form.append('height', '540')

    const formResponse = new Response(form)
    const formStream = formResponse.body
    const formContentType = formResponse.headers.get('content-type')!

    const response = await env.AI.run("@cf/black-forest-labs/flux-2-klein-4b", {//@cf/black-forest-labs/flux-1-schnell @cf/black-forest-labs/flux-2-klein-4b
      multipart: {
        body: formStream,
        contentType: formContentType
      }
    })

    return Response.json(response)
}