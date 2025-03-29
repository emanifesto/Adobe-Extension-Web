const hero = document.querySelector('div.hero > a.ctv')
const setup = document.querySelector('div.setup-sect > a.ctv')
const features = document.querySelector('div.features > h2.features-header')
const ctv = document.querySelector('main > a.ctv')

function stall(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

const ctvObserver = new IntersectionObserver( (entries) => {
    entries.forEach(async (entry) => {
        console.log(entry)
        if (entry.target.className === 'ctv'){
            if (entry.isIntersecting){
                ctv.classList.remove('persist')
                await stall(1000)
                ctv.classList.add('hidden')
            } else{
                if(entry.target.parentNode.className === 'hero'){
                    ctv.classList.remove('hidden')
                    await stall(200)
                    ctv.classList.add('persist')
                }
            }
        }
        else if(entry.target.className === 'features-header'){
            if (entry.isIntersecting){
                ctv.classList.remove('hidden')
                await stall(200)
                ctv.classList.add('persist')
            }
        }
    })
})

// setTimeout(function(){
    ctvObserver.observe(hero)
    ctvObserver.observe(setup)
    ctvObserver.observe(features)
// }, 0)