export const onRequestGet = async ({request, env}: {request: Request, env: {AI: any}}) => {
    // const characterReference = await fetch('https://damisaas.com/assets/images/headshot.jpg')

    const jobTitles = ["Software Engineer & Founder", "Java Supplemental Instructor", "AI/ML Researcher"]
    const artSytles = ["Anime", "Comic", "Pop", "Surrealism", "Cubism", "Chibi"]

    const idx1 = Math.floor(Math.random() * jobTitles.length)
    const idx2 = Math.floor(Math.random() * artSytles.length)

    const job = jobTitles[idx1]
    const style = artSytles[idx2]


    // return new Response(response, {
    //   headers: {
    //     "content-type": "image/png",
    //   },
    // });

    const form = new FormData()
    form.append('prompt', `A male African-American ${job} in a unique random relevant setting. ${style} art-style.`)
    form.append('width', '960')
    form.append('height', '540')

    const formResponse = new Response(form)
    const formStream = formResponse.body
    const formContentType = formResponse.headers.get('content-type')!

    const response = await env.AI.run("@cf/black-forest-labs/flux-2-klein-9b", {
      multipart: {
        body: formStream,
        contentType: formContentType
      }
    })
    console.log(response)
    console.log(await response.json())
    console.log(Response.json(response))

    return new Response('OK', {status: 200})
    // return Response.json(response)
}