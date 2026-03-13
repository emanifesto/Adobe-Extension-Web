export const onRequestGet = async ({request, env}: {request: Request, env: {AI: any}}) => {
    const characterReference = await fetch('https://damisaas.com/assets/images/headshot.jpg')

    const jobTitles = ["Software Engineer & Founder", "Java Supplemental Instructor", "AI/ML Researcher"]
    const artSytles = ["Anime", "Comic", "Pop", "Surrealism", "Cubism", "Chibi"]

    const idx1 = Math.floor(Math.random() * jobTitles.length)
    const idx2 = Math.floor(Math.random() * artSytles.length)

    const job = jobTitles[idx1]
    const style = artSytles[idx2]

    const inputs = {
        'prompt': `Using character reference, create an image of a ${job} in a unique random relevant setting. ${style} art-style.`,
        'image': [...new Uint8Array(await characterReference.arrayBuffer())],
        'width': 960,
        'height': 540,
    }

    const response = await env.AI.run(
        "@cf/runwayml/stable-diffusion-v1-5-img2img",
        inputs
    )

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });

    // const form = new FormData()
    // form.append('prompt', `An African-American ${job} in a unique random relevant setting. ${style} art-style.`)
    // form.append('width', '960')
    // form.append('height', '540')

    // const formResponse = new Response(form)
    // const formStream = formResponse.body
    // const formContentType = formResponse.headers.get('content-type')!

    // const response = await env.AI.run("@cf/black-forest-labs/flux-2-klein-9b", {
    //   multipart: {
    //     body: formStream,
    //     contentType: formContentType
    //   }
    // })

    // return Response.json(response)
}