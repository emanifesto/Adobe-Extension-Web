export const onRequestGet = async ({request, env}: {request: Request, env: {AI: any}}) => {
    const characterReference = await fetch('/founder/headshot.jpg')

    const jobTitles = ["Software Engineer & Founder", "Java Supplemental Instructor", "AI/ML Researcher"]
    const artSytles = ["Anime", "Comic", "Pop", "Surrealism", "Cubism", "Chibi"]

    const idx1 = Math.floor(Math.random() * jobTitles.length)
    const idx2 = Math.floor(Math.random() * artSytles.length)

    const job = jobTitles[idx1]
    const style = artSytles[idx2]

    const inputs = {
        'prompt': `Using character reference, create an image of a ${job} in a unique random relevant setting. ${style} art-style.`,
        'image': [new Uint8Array(await characterReference.arrayBuffer())],
        width: 960,
        height: 540,
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
}